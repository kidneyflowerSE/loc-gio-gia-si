const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Blog = require('../models/blog.model');
const Contact = require('../models/contact.model');
const Admin = require('../models/admin.model');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Get basic counts
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ status: 'available' });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });

    // Get monthly statistics
    const ordersThisMonth = await Order.countDocuments({
      orderDate: { $gte: startOfMonth }
    });
    const ordersLastMonth = await Order.countDocuments({
      orderDate: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const contactsThisMonth = await Contact.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const contactsLastMonth = await Contact.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Calculate growth rates
    const orderGrowth = ordersLastMonth > 0 
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100).toFixed(1)
      : 0;
    const contactGrowth = contactsLastMonth > 0
      ? ((contactsThisMonth - contactsLastMonth) / contactsLastMonth * 100).toFixed(1)
      : 0;

    // Get revenue statistics (if orders have prices)
    const revenueStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startOfMonth },
          status: { $in: ['confirmed', 'processing', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get most viewed products
    const topProducts = await Product.find()
      .sort({ views: -1 })
      .limit(5)
      .select('name brand model views price');

    // Get recent activities
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(5)
      .select('orderNumber customer.name totalAmount status orderDate');

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject status createdAt');

    // Get monthly order chart data
    const orderChartData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: new Date(today.getFullYear(), today.getMonth() - 11, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get product category distribution
    const productBrandDistribution = await Product.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          availableProducts,
          totalOrders,
          pendingOrders,
          totalBlogs,
          publishedBlogs,
          totalContacts,
          newContacts
        },
        growth: {
          ordersThisMonth,
          orderGrowth: parseFloat(orderGrowth),
          contactsThisMonth,
          contactGrowth: parseFloat(contactGrowth)
        },
        revenue: {
          total: revenueStats[0]?.totalRevenue || 0,
          average: revenueStats[0]?.averageOrderValue || 0,
          monthly: monthlyRevenue[0]?.revenue || 0
        },
        topProducts,
        recentActivities: {
          orders: recentOrders,
          contacts: recentContacts
        },
        charts: {
          monthlyOrders: orderChartData,
          orderStatus: orderStatusDistribution,
          productBrands: productBrandDistribution
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ status: 'available' });
    const soldProducts = await Product.countDocuments({ status: 'sold' });
    const reservedProducts = await Product.countDocuments({ status: 'reserved' });

    // Get brand distribution
    const brandStats = await Product.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalViews: { $sum: '$views' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get year distribution
    const yearStats = await Product.aggregate([
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    // Get price range distribution
    const priceRangeStats = await Product.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 500000000, 1000000000, 1500000000, 2000000000, 999999999999],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          availableProducts,
          soldProducts,
          reservedProducts
        },
        brandStats,
        yearStats,
        priceRangeStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product statistics',
      error: error.message
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // Get monthly order trends
    const monthlyTrends = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get top customers
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: '$customer.email',
          customerName: { $first: '$customer.name' },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { totalAmount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get revenue by payment method
    const paymentMethodStats = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          pendingOrders,
          confirmedOrders,
          completedOrders,
          cancelledOrders
        },
        monthlyTrends,
        topCustomers,
        paymentMethodStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};

// Get blog statistics
const getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });
    const archivedBlogs = await Blog.countDocuments({ status: 'archived' });

    // Get category distribution
    const categoryStats = await Blog.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get most viewed blogs
    const topBlogs = await Blog.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(10)
      .select('title author views publishDate');

    // Get monthly publication trends
    const monthlyPublications = await Blog.aggregate([
      {
        $match: {
          status: 'published',
          publishDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$publishDate' },
            month: { $month: '$publishDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalBlogs,
          publishedBlogs,
          draftBlogs,
          archivedBlogs
        },
        categoryStats,
        topBlogs,
        monthlyPublications
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getProductStats,
  getOrderStats,
  getBlogStats
};
