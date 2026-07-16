import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      "home": "الرئيسية",
      "perfumes": "العطور",
      "services": "خدماتنا",
      "contact": "تواصل معنا",
      "search_placeholder": "ابحث عن عطرك المفضل...",
      "hero_badge": "المجموعة الحصرية",
      "hero_title": "عطور فاخرة بجودة استثنائية",
      "hero_subtitle": "اكتشف مجموعتنا الحصرية من أرقى العطور الرجالية المصنوعة بأفضل المكونات وأعلى تركيز لثبات يدوم طوال اليوم",
      "hero_cta": "تصفح المجموعة",
      "services_tag": "خدمات مميزة",
      "services_title": "خدماتنا الخاصة",
      "services_subtitle": "نقدم لك خدمات حصرية لتجربة عطرية فريدة من نوعها",
      "follow_us": "تابعنا",
      "social_media": "حساباتنا",
      "social_subtitle": "تابعنا على منصات التواصل الاجتماعي",
      "quick_links": "روابط سريعة",
      "available_24_7": "متاح 24 ساعة",
      "delivery_all": "توصيل لجميع المحافظات",
      "choose_size": "اختر الحجم",
      "price": "السعر",
      "phone_placeholder": "رقم الهاتف للتواصل",
      "promo_code_placeholder": "لديك كود خصم؟ أدخله هنا",
      "apply": "تطبيق",
      "order_whatsapp": "تأكيد الأوردر عبر واتساب",
      "order_success": "تم تأكيد الأوردر بنجاح! سيتم التواصل معك خلال 24 ساعة",
      "admin_panel": "لوحة التحكم",
      "dashboard": "نظرة عامة",
      "categories": "التصنيفات",
      "promo_codes": "أكواد الخصم",
      "settings": "الإعدادات",
      "currency": "ج.م",
      "starts_from": "يبدأ من",
      "no_category": "بدون تصنيف",
      "products_title": "اكتشف مجموعتنا الحصرية من أرقى العطور الرجالية",
      "new_order": "طلب جديد:",
      "size": "الحجم:",
      "final_price": "السعر النهائي:",
      "phone": "الهاتف:",
      "discount_code": "كود الخصم:"
    }
  },
  en: {
    translation: {
      "home": "Home",
      "perfumes": "Perfumes",
      "services": "Services",
      "contact": "Contact Us",
      "search_placeholder": "Search for your favorite perfume...",
      "hero_badge": "Exclusive Collection",
      "hero_title": "Luxury Perfumes with Exceptional Quality",
      "hero_subtitle": "Discover our exclusive collection of the finest men's perfumes made with the best ingredients and highest concentration for a scent that lasts all day.",
      "hero_cta": "Browse Collection",
      "services_tag": "Premium Services",
      "services_title": "Our Special Services",
      "services_subtitle": "We offer exclusive services for a unique aromatic experience",
      "follow_us": "Follow Us",
      "social_media": "Our Accounts",
      "social_subtitle": "Follow us on social media platforms",
      "quick_links": "Quick Links",
      "available_24_7": "Available 24/7",
      "delivery_all": "Delivery to all governorates",
      "choose_size": "Choose Size",
      "price": "Price",
      "phone_placeholder": "Phone Number",
      "promo_code_placeholder": "Have a promo code? Enter here",
      "apply": "Apply",
      "order_whatsapp": "Confirm Order via WhatsApp",
      "order_success": "Order confirmed successfully! We will contact you within 24 hours",
      "admin_panel": "Admin Panel",
      "dashboard": "Dashboard",
      "categories": "Categories",
      "promo_codes": "Promo Codes",
      "settings": "Settings",
      "currency": "EGP",
      "starts_from": "Starts from",
      "no_category": "No Category",
      "products_title": "Discover our exclusive collection of the finest men's perfumes",
      "new_order": "New Order:",
      "size": "Size:",
      "final_price": "Final Price:",
      "phone": "Phone:",
      "discount_code": "Discount Code:"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // default language
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
