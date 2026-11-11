/* ============================================================
   data.js — كل نصوص وصور الموقع في مكان واحد
   ============================================================
   هاي أسهل طريقة تتحكم فيها بمحتوى الموقع من غير ما تلمس ملفات
   الـHTML أو الـCSS أو تحتاج مبرمج لكل تعديل بسيط.

   كيف تستخدمه:
   - أي نص: لاقي المكان المناسب تحت وبدّل القيمة بين علامتي التنصيص "...".
     كل نصوص الموقع (بكل الصفحات الثمانية) لها لغتين { ar: "...", en: "..." } —
     لازم تعدّل الاثنين مع بعض حتى يبقى المحتوى متطابق بالعربي والإنجليزي.
   - أي صورة: حمّل الصورة الجديدة داخل مجلد assets/images (أو المجلد
     المناسب المذكور جنب كل حقل صورة)، وبدّل بس اسم/مسار الملف بالقيمة.
     خلي نفس صيغة الملف تقريباً (jpg/png) وحجم مقارب حتى ما يتغيّر شكل
     الموقع. لازم الصورة تكون فعلاً موجودة بنفس المسار وإلا بتظهر مكسورة.
   - عناصر زي "آراء العملاء" و"معرض الأعمال" هي قائمة (array) — تقدر
     تضيف عنصر جديد بنسخ آخر {...} داخل الأقواس المربعة [...] وتعدّل
     قيَمه، أو تحذف عنصر كامل بحذف الـ{...} تبعه (وحذف الفاصلة الزايدة
     إذا صار آخر عنصر).
   - لا تحذف الفواصل (,) أو الأقواس { } [ ] — بس بدّل النصوص والمسارات
     بين علامتي التنصيص. لو صار خطأ بالملف الموقع كله بيتوقف عن الشغل،
     فبعد أي تعديل افتح الموقع وتأكد إنه شغال زي العادة.
   ============================================================ */

const SITE_DATA = {

  /* عنوان المتصفح ووصف المحرك لكل صفحة */
  meta: {
    home: {
      title: { ar: "Thaer Media — نوظِّفُ خبرتنا لنجاح علامتك التجارية", en: "Thaer Media — We turn experience into brand success" },
      description: "Thaer Media — Social media design, brand identity, advertising campaigns, creative design, content creation and marketing solutions."
    }
  },

  /* بيانات التواصل الأساسية — مستخدمة بعدة أماكن بالموقع (الفوتر، صفحة
     التواصل، زر واتساب بالهيدر...)، فتعديلها هون يغيّرها بكل مكان مرة وحدة */
  contact: {
    whatsappNumber: "970599351383",
    whatsappUrl: "https://wa.me/970599351383",
    whatsappDisplay: "+970 59 935 1383",
    email: "thaeralqrenawi@gmail.com",
    emailUrl: "mailto:thaeralqrenawi@gmail.com"
  },

  /* زر "ابدأ مشروعك" بأعلى يمين الهيدر — موجود بكل الصفحات الثمانية */
  headerCta: { ar: "ابدأ مشروعك", en: "Start a project" },

  /* روابط منصات التواصل الاجتماعي — تظهر بأيقونات بفوتر كل صفحة */
  socials: [
    { key: "whatsapp", url: "https://wa.me/970599351383" },
    { key: "email", url: "mailto:thaeralqrenawi@gmail.com" },
    { key: "instagram", url: "https://www.instagram.com/thaerdesigner/" },
    { key: "facebook", url: "https://www.facebook.com/thaerdesigner12" },
    { key: "linkedin", url: "https://www.linkedin.com/in/thaerdesigner/" },
    { key: "behance", url: "https://www.behance.net/gallery/215783633/My-Portfolio-2022-2024" },
    { key: "x", url: "https://www.x.com/thaerdesigner" },
    { key: "threads", url: "https://www.threads.net/@thaerdesigner" },
    { key: "tiktok", url: "https://www.tiktok.com/@thaerdesigner" },
    { key: "snapchat", url: "https://www.snapchat.com/add/thaerdesigner" }
  ],

  /* روابط قائمة التنقل بالهيدر (الصفحة الرئيسية فقط، ثنائية اللغة) */
  nav: [
    { href: "#home", ar: "الرئيسية", en: "Home" },
    { href: "#services", ar: "الخدمات", en: "Services" },
    { href: "#work", ar: "أعمالنا", en: "Work" },
    { href: "#about", ar: "من نحن", en: "About" },
    { href: "#process", ar: "كيف نعمل", en: "Process" },
    { href: "#testimonials", ar: "آراء العملاء", en: "Testimonials" },
    { href: "contact.html", ar: "تواصل", en: "Contact" }
  ],

  /* ======================== الصفحة الرئيسية ======================== */
  home: {

    hero: {
      // الصورة الشخصية بأعلى الصفحة الرئيسية — غيّر المسار لصورة جديدة بنفس المقاس تقريباً (عمودي)
      photo: "assets/images/hero-person.jpg",
      heading: { ar: "<span class='heading-white'>نوظِّفُ خبرتنا</span><span class='heading-gold'>لنجاح علامتك التجارية</span>", en: "<span class='heading-white'>We turn experience into</span><span class='heading-gold'>brand success</span>" },
      paragraph: {
        ar: "نصنع حضوراً رقمياً متكاملاً من خلال تقديم خدمات التصميم الإبداعي والهوية البصرية وصناعة المحتوى والحملات الإعلانية",
        en: "We build distinctive digital presence through creative design, brand identity, content creation and advertising campaigns."
      },
      primaryButton: { href: "contact.html", ar: "لنتحدث عن مشروعك", en: "Let's discuss your project" },
      secondaryButton: { href: "#work", ar: "شاهد أعمالنا", en: "Explore our work" },
      chipOne: { ar: "إبداع × استراتيجية", en: "Creative × Strategy" },
      chipTwo: { ar: "تصميم • محتوى • إعلانات", en: "Design • Content • Ads" },
      yearsOfExperience: 12,
      metricYearsLabel: { ar: "عاماً من الخبرة", en: "Years of experience" },
      metricSolutions: { ar: "حلول تسويقية<br>متكاملة", en: "Integrated<br>marketing solutions" },
      metricPresence: { ar: "حضور عربي<br>وعالمي", en: "Arabic &<br>global presence" }
    },

    servicesHead: {
      heading: { ar: "<span class='section-kicker'>خدماتنا:</span> ما نستطيع تقديمه لعلامتك أو نشاطك التجاري", en: "<span class='section-kicker'>Our services:</span> What we can provide for your brand or business" },
      paragraph: {
        ar: "من الفكرة إلى التنفيذ، نربط التصميم والتسويق والمحتوى ضمن منظومة واحدة متناسقة.",
        en: "From idea to execution, we connect design, marketing and content into one coherent system."
      }
    },
    /* بطاقات "خدماتنا" الست — الأيقونة مسار صورة (تقدر تبدّلها من مجلد assets/service-icons) */
    services: [
      { slug: "social", href: "work-social.html", icon: "assets/service-icons/social.svg",
        title: { ar: "تصاميم السوشيال ميديا", en: "Social Media Design" },
        desc: { ar: "تصاميم تجارية مميزة ولافتة تعكس هوية العلامة التجارية وتبني حضوراً بصرياً ثابتاً.", en: "Distinctive commercial designs that reflect your brand identity and build a consistent visual presence." } },
      { slug: "identity", href: "work-identity.html", icon: "assets/service-icons/branding.png",
        title: { ar: "الهوية البصرية", en: "Brand Identity" },
        desc: { ar: "نظام بصري متكامل يمنح علامتك التجارية حضوراً احترافياً قابلاً للتوسع والانتشار.", en: "A complete visual system that gives your brand a professional presence built to scale and grow." } },
      { slug: "ads", href: "work-ads.html", icon: "assets/service-icons/megaphone.png",
        title: { ar: "إدارة الحملات الإعلانية", en: "Advertising Campaign Management" },
        desc: { ar: "إنشاء وإدارة حملاتك الإعلانية المدفوعة على منصات التواصل للوصول إلى أكبر جمهور ممكن.", en: "Creating and managing your paid advertising campaigns on social platforms to reach the largest possible audience." } },
      { slug: "print", href: "work-print.html", icon: "assets/service-icons/offset.png",
        title: { ar: "تصاميم المطبوعات", en: "Print Design" },
        desc: { ar: "تصاميم بصرية مبتكرة وغير تقليدية للمطبوعات لأصحاب الشركات والمؤسسات والأنشطة التجارية.", en: "Innovative, unconventional visual designs for print materials for companies, institutions and businesses." } },
      { slug: "content", href: "work-content.html", icon: "assets/service-icons/video.png",
        title: { ar: "صناعة المحتوى", en: "Content Creation" },
        desc: { ar: "إنشاء وتعديل المحتوى المرئي لإظهار علامتك التجارية من خلال فيديوهات مميزة تشمل الموشن جرافيك والمونتاج.", en: "Creating and editing visual content to present your brand through distinctive videos, including motion graphics and video editing." } },
      { slug: "marketing", href: "#work", icon: "assets/service-icons/innovation.png",
        title: { ar: "حلول تسويقية", en: "Marketing Solutions" },
        desc: { ar: "استشارات تسويقية عملية تساعدك على اتخاذ قرارات أفضل وبناء حضور أقوى.", en: "Practical marketing consulting that helps you make better decisions and build a stronger presence." } }
    ],

    workHead: {
      heading: { ar: "<span class='section-kicker'>مختارات من أعمالنا:</span> معرض لبعض أعمالنا المميزة", en: "<span class='section-kicker'>Selected work:</span> A selection of our featured work" },
      paragraph: {
        ar: "معرض مرن لعرض المشاريع بأسلوب بصري متنوع، مع معلومات المشروع فوق الصورة عند التفاعل.",
        en: "A flexible showcase for our projects with varied visual compositions and project information revealed on interaction."
      }
    },
    /* شريط "مختارات من أعمالنا" بالصفحة الرئيسية — صورة الغلاف مختلفة حسب
       اللغة (عربي/إنجليزي)، من مجلد assets/work-covers/ar أو /en */
    workTeaser: [
      { slug: "social", href: "work-social.html", coverAr: "assets/work-covers/ar/01-social-media.jpg", coverEn: "assets/work-covers/en/01-social-media.jpg", badge: "01 · SOCIAL MEDIA",
        title: { ar: "تصاميم السوشيال ميديا", en: "Social Media Design" },
        desc: { ar: "استعرض أعمالنا في تصاميم السوشيال ميديا.", en: "Explore our social media design work." } },
      { slug: "identity", href: "work-identity.html", coverAr: "assets/work-covers/ar/02-brand-identity.jpg", coverEn: "assets/work-covers/en/02-brand-identity.jpg", badge: "02 · BRAND IDENTITY",
        title: { ar: "الهوية البصرية", en: "Brand Identity" },
        desc: { ar: "استعرض أعمالنا في بناء الهوية البصرية.", en: "Explore our brand identity work." } },
      { slug: "ads", href: "work-ads.html", coverAr: "assets/work-covers/ar/03-advertising.jpg", coverEn: "assets/work-covers/en/03-advertising.jpg", badge: "03 · ADVERTISING",
        title: { ar: "إدارة الحملات الإعلانية", en: "Advertising Campaigns" },
        desc: { ar: "استعرض أعمالنا في الحملات الإعلانية.", en: "Explore our advertising campaign work." } },
      { slug: "print", href: "work-print.html", coverAr: "assets/work-covers/ar/04-print-design.jpg", coverEn: "assets/work-covers/en/04-print-design.jpg", badge: "04 · PRINT DESIGN",
        title: { ar: "تصاميم المطبوعات", en: "Print Design" },
        desc: { ar: "استعرض أعمالنا في تصاميم المطبوعات.", en: "Explore our print design work." } },
      { slug: "content", href: "work-content.html", coverAr: "assets/work-covers/ar/05-content-creation.jpg", coverEn: "assets/work-covers/en/05-content-creation.jpg", badge: "05 · CONTENT",
        title: { ar: "صناعة المحتوى", en: "Content Creation" },
        desc: { ar: "استعرض أعمالنا في صناعة المحتوى المرئي.", en: "Explore our visual content work." } }
    ],

    about: {
      // ثلاث صور قسم "من نحن" (اللوحة الكبيرة + صورتين صغار)
      mainPhoto: "assets/images/about-main.jpg",
      miniPhotoOne: "assets/images/about-palette.jpg",
      miniPhotoTwo: "assets/images/about-desk.jpg",
      heading: { ar: "<span class='section-kicker'>من نحن:</span> خبرة تفهم العلامة قبل أن تصممها", en: "<span class='section-kicker'>About us:</span> Experience that understands the brand before designing it" },
      lead: {
        ar: "نبدأ من فهم علامتك التجارية، جمهورها وهدفها، ثم نبني لغة بصرية وتسويقية تخدمها.",
        en: "At Thaer Media, we don't start from a template. We start by understanding the brand, its audience and its goal, then build a visual and marketing language around it."
      },
      paragraph: {
        ar: "نجمع بين خدمات متنوعة ما بين التصميم الإحترافي وصناعة المحتوى وإدارة الحملات والحلول التسويقية لنمنح المشاريع حضوراً متماسكاً في منصات التواصل.",
        en: "We combine commercial design, content creation, campaign management and marketing solutions to give businesses a consistent social presence."
      },
      bullets: [
        { ar: "تفكير استراتيجي", en: "Strategic thinking" },
        { ar: "تنفيذ إبداعي", en: "Creative execution" },
        { ar: "هوية متناسقة", en: "Consistent identity" },
        { ar: "حلول قابلة للتوسع", en: "Scalable solutions" }
      ]
    },

    processHead: {
      heading: { ar: "<span class='section-kicker'>كيف نعمل:</span> من الاستماع إلى التسليم", en: "<span class='section-kicker'>Our process:</span> From listening to delivery" },
      paragraph: {
        ar: "خمس مراحل واضحة تحافظ على جودة المشروع واتساقه من البداية للنهاية.",
        en: "Five clear stages that keep the project focused and consistent from start to finish."
      }
    },
    process: [
      { num: "01", title: { ar: "نفهم", en: "Listen" }, desc: { ar: "نستمع للهدف، الجمهور والتحدي.", en: "We listen to the goal, audience and challenge." } },
      { num: "02", title: { ar: "نخطط", en: "Plan" }, desc: { ar: "نحدد الاتجاه والرسالة والأولويات.", en: "We define direction, message and priorities." } },
      { num: "03", title: { ar: "نبدع", en: "Create" }, desc: { ar: "نحوّل الاستراتيجية إلى أفكار بصرية.", en: "We turn strategy into visual ideas." } },
      { num: "04", title: { ar: "ننّفذ", en: "Execute" }, desc: { ar: "ننتج ونطوّر ونجهز المخرجات.", en: "We produce, refine and prepare deliverables." } },
      { num: "05", title: { ar: "نراجع", en: "Review" }, desc: { ar: "نتأكد من الجودة والتسليم بالشكل الصحيح.", en: "We review quality and deliver everything properly." } }
    ],

    testimonialsHead: {
      heading: { ar: "<span class='section-kicker'>آراء العملاء:</span> تجارب تستحق أن تُسمع", en: "<span class='section-kicker'>Client feedback:</span> Experiences worth hearing" },
      paragraph: {
        ar: "مساحة تفاعلية لعرض آراء العملاء بشكل واضح وأنيق.",
        en: "An interactive space for presenting client feedback with clarity and style."
      }
    },
    /* آراء العملاء — كل ما تضيف عميل جديد ضيف {...} جديد هون، بينضاف
       تلقائياً كشريحة جديدة بالسلايدر (وما في حد أقصى للعدد) */
    testimonials: [
      { avatar: "01", quote: { ar: "“تصميم احترافي، فهم سريع للهدف، ونتيجة تعكس العلامة بالشكل الذي كنا نبحث عنه.”", en: "“Professional design, fast understanding of the objective, and a result that truly reflects the brand.”" },
        author: { ar: "عميل Thaer Media", en: "Thaer Media client" } },
      { avatar: "02", quote: { ar: "“العمل كان منظماً وواضحاً من الفكرة حتى التسليم، والهوية ظهرت بشكل أقوى بكثير.”", en: "“The process was clear and organized from concept to delivery, and the identity became much stronger.”" },
        author: { ar: "عميل Thaer Media", en: "Thaer Media client" } },
      { avatar: "03", quote: { ar: "“احترافية في التفاصيل، ومرونة في التعديل، والأهم أن النتيجة كانت عملية وليست مجرد شكل.”", en: "“Attention to detail, flexibility during revisions, and most importantly, a result that works—not just looks good.”" },
        author: { ar: "عميل Thaer Media", en: "Thaer Media client" } }
    ],

    cta: {
      heading: { ar: "<span class='section-kicker'>لنبدأ:</span> لديك فكرة؟ خلّينا نحولها إلى حضور قوي.", en: "<span class='section-kicker'>Let's begin:</span> Have an idea? Let's build a strong presence." },
      paragraph: {
        ar: "أرسل تفاصيل مشروعك أو الخدمة التي تحتاجها، وسنبدأ من فهم احتياجك وتحديد أفضل اتجاه للتنفيذ.",
        en: "Send us your project details or the service you need. We'll start by understanding your needs and defining the right direction."
      },
      whatsappButton: { ar: "تواصل عبر واتساب", en: "Chat on WhatsApp" },
      emailButton: { ar: "راسلنا بالبريد", en: "Email us" }
    }
  },

  /* ======================== الفوتر (كل الصفحات) ======================== */
  footer: {
    tagline: {
      ar: "حلول إبداعية وتسويقية تساعد العلامات التجارية على بناء حضور أقوى وأكثر اتساقاً.",
      en: "Creative and marketing solutions that help brands build a stronger, more consistent presence."
    },
    linksTitle: { ar: "روابط", en: "Links" },
    servicesTitle: { ar: "الخدمات", en: "Services" },
    contactTitle: { ar: "تواصل", en: "Contact" },
    /* أسماء الخدمات الأربعة بعمود "الخدمات" بالفوتر (تختصر، مش لازم تطابق الست خدمات بالضبط) */
    servicesList: [
      { ar: "تصاميم السوشيال ميديا", en: "Social Media Design" },
      { ar: "الهوية البصرية", en: "Brand Identity" },
      { ar: "إدارة الحملات الإعلانية", en: "Advertising Campaigns" },
      { ar: "صناعة المحتوى", en: "Content Creation" }
    ],
    copyright: {
      ar: " Thaer Media. جميع الحقوق محفوظة.",
      en: " Thaer Media. All rights reserved."
    }
  },

  /* ======================== صفحات الأعمال الستة ======================== */
  /* كل صفحة إلها عنوان ووصف بلغتين، ومعرض صور (gallery) تقدر تضيف/تحذف/
     تعدّل عناصره بحرية. "image" خليها فاضية "" لين توفر صورة حقيقية
     للمشروع — وقتها بتظهر الصورة بدل الخلفية الزخرفية الحالية. */
  work: {
    social: {
      title: { ar: "تصاميم السوشيال ميديا", en: "Social Media Design" },
      description: { ar: "هنا سنعرض الأعمال الخاصة بخدمة تصاميم السوشيال ميديا بعد إضافة المشاريع والصور المعتمدة.", en: "Here we'll showcase our social media design work once the approved projects and photos have been added." },
      gallery: [
        { number: "01", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/social/01.jpg" },
        { number: "02", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/social/02.jpg" },
        { number: "03", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/social/03.jpg" },
        { number: "04", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/social/04.jpg" },
        { number: "05", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/social/05.jpg" },
        { number: "06", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/social/06.jpg" }
      ]
    },
    identity: {
      title: { ar: "الهوية البصرية", en: "Brand Identity" },
      description: { ar: "هنا سنعرض الأعمال الخاصة بخدمة الهوية البصرية بعد إضافة المشاريع والصور المعتمدة.", en: "Here we'll showcase our brand identity work once the approved projects and photos have been added." },
      gallery: [
        { number: "01", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/identity/01.jpg" },
        { number: "02", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/identity/02.jpg" },
        { number: "03", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/identity/03.jpg" },
        { number: "04", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/identity/04.jpg" },
        { number: "05", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/identity/05.jpg" },
        { number: "06", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/identity/06.jpg" }
      ]
    },
    ads: {
      title: { ar: "إدارة الحملات الإعلانية", en: "Advertising Campaign Management" },
      description: { ar: "هنا سنعرض الأعمال الخاصة بخدمة إدارة الحملات الإعلانية بعد إضافة المشاريع والصور المعتمدة.", en: "Here we'll showcase our advertising campaign management work once the approved projects and photos have been added." },
      gallery: [
        { number: "01", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/ads/01.jpg" },
        { number: "02", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/ads/02.jpg" },
        { number: "03", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/ads/03.jpg" },
        { number: "04", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/ads/04.jpg" },
        { number: "05", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/ads/05.jpg" },
        { number: "06", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/ads/06.jpg" }
      ]
    },
    print: {
      title: { ar: "تصاميم المطبوعات", en: "Print Design" },
      description: { ar: "هنا سنعرض الأعمال الخاصة بخدمة تصاميم المطبوعات بعد إضافة المشاريع والصور المعتمدة.", en: "Here we'll showcase our print design work once the approved projects and photos have been added." },
      gallery: [
        { number: "01", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/print/01.jpg" },
        { number: "02", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/print/02.jpg" },
        { number: "03", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/print/03.jpg" },
        { number: "04", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/print/04.jpg" },
        { number: "05", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/print/05.jpg" },
        { number: "06", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/print/06.jpg" }
      ]
    },
    content: {
      title: { ar: "صناعة المحتوى", en: "Content Creation" },
      description: { ar: "هنا سنعرض الأعمال الخاصة بخدمة صناعة المحتوى بعد إضافة المشاريع والصور المعتمدة.", en: "Here we'll showcase our content creation work once the approved projects and photos have been added." },
      gallery: [
        { number: "01", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/content/01.jpg" },
        { number: "02", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/content/02.jpg" },
        { number: "03", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/content/03.jpg" },
        { number: "04", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/content/04.jpg" },
        { number: "05", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/content/05.jpg" },
        { number: "06", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/content/06.jpg" }
      ]
    },
    marketing: {
      title: { ar: "حلول تسويقية", en: "Marketing Solutions" },
      description: { ar: "هنا سنعرض الأعمال الخاصة بخدمة حلول تسويقية بعد إضافة المشاريع والصور المعتمدة.", en: "Here we'll showcase our marketing solutions work once the approved projects and photos have been added." },
      gallery: [
        { number: "01", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/marketing/01.jpg" },
        { number: "02", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/marketing/02.jpg" },
        { number: "03", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/marketing/03.jpg" },
        { number: "04", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/marketing/04.jpg" },
        { number: "05", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/marketing/05.jpg" },
        { number: "06", title: { ar: "مساحة عمل", en: "Project Space" }, description: { ar: "سيتم إضافة المشروع هنا.", en: "The project will be added here." }, image: "assets/gallery/marketing/06.jpg" }
      ]
    }
  },

  /* ======================== صفحة التواصل ======================== */
  contactPage: {
    title: { ar: "Thaer Media — تواصل معنا", en: "Thaer Media — Contact Us" },
    heading: { ar: "<span class='section-kicker'>لنبدأ:</span> لنتحدث عن مشروعك", en: "<span class='section-kicker'>Let's begin:</span> Let's talk about your project" },
    paragraph: { ar: "أرسل تفاصيل مشروعك أو الخدمة التي تحتاجها، وسنبدأ من فهم احتياجك وتحديد أفضل اتجاه للتنفيذ.", en: "Send us your project details or the service you need, and we'll start by understanding your needs and defining the best direction for execution." },
    /* type يحدد واتساب أو إيميل حتى ياخذ الرقم/الرابط من SITE_DATA.contact تلقائياً (مكان
       واحد لتحديث رقم الواتساب أو الإيميل بدل تكراره هون كمان) */
    methods: [
      { type: "whatsapp", title: { ar: "واتساب", en: "WhatsApp" }, description: { ar: "أسرع طريقة للتواصل معنا والرد على استفساراتك.", en: "The fastest way to reach us and get your questions answered." } },
      { type: "email", title: { ar: "البريد الإلكتروني", en: "Email" }, description: { ar: "لمشاركة تفاصيل المشروع أو الملفات المطلوبة.", en: "To share your project details or required files." } }
    ],
    processHeading: { ar: "<span class='section-kicker'>كيف نبدأ:</span> من أول رسالة إلى بداية العمل", en: "<span class='section-kicker'>How we start:</span> From first message to kickoff" },
    processParagraph: { ar: "ثلاث خطوات بسيطة من أول تواصل إلى انطلاق المشروع.", en: "Three simple steps from first contact to project kickoff." },
    process: [
      { num: "01", title: { ar: "تواصل معنا", en: "Contact us" }, description: { ar: "راسلنا عبر واتساب أو البريد الإلكتروني وأخبرنا عن فكرتك أو الخدمة التي تحتاجها.", en: "Message us on WhatsApp or email and tell us about your idea or the service you need." } },
      { num: "02", title: { ar: "نفهم احتياجك", en: "We understand your needs" }, description: { ar: "نستمع للهدف والجمهور والتحدي، ونحدد أفضل اتجاه للتنفيذ.", en: "We listen to the goal, audience and challenge, and define the best direction for execution." } },
      { num: "03", title: { ar: "نبدأ العمل", en: "We start the work" }, description: { ar: "نتفق على التفاصيل والجدول الزمني، ونباشر بتحويل الفكرة إلى نتيجة ملموسة.", en: "We agree on the details and timeline, and begin turning the idea into a tangible result." } }
    ]
  }

};
