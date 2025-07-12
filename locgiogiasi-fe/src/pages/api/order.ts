import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { cartItems, customer } = req.body as {
    cartItems: { name: string; quantity: number; price: number }[];
    customer: { name: string; phone: string; email?: string; address?: string; note?: string };
  };

  if (!cartItems?.length || !customer?.name || !customer?.phone) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <h2>Đơn hàng mới từ trang web</h2>
    <h3>Thông tin khách hàng</h3>
    <p><strong>Họ tên:</strong> ${customer.name}</p>
    <p><strong>Điện thoại:</strong> ${customer.phone}</p>
    ${customer.email ? `<p><strong>Email:</strong> ${customer.email}</p>` : ""}
    ${customer.address ? `<p><strong>Địa chỉ:</strong> ${customer.address}</p>` : ""}
    ${customer.note ? `<p><strong>Ghi chú:</strong> ${customer.note}</p>` : ""}
    <h3>Sản phẩm đặt mua</h3>
    <ul>
      ${cartItems
        .map(
          (item) =>
            `<li>${item.name} (SL: ${item.quantity}) - ${item.price.toLocaleString("vi-VN")}₫</li>`
        )
        .join("")}
    </ul>
  `;

  try {
    await transporter.sendMail({
      from: `Website Order <${process.env.SMTP_USER}>`,
      to: process.env.MANAGER_EMAIL,
      subject: "Đơn hàng mới",
      html,
    });
    return res.status(200).json({ message: "Order sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending email" });
  }
} 