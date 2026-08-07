// Translation catalog for the app's interactive UI chrome. Covers the 10
// languages listed in state/slices/localeSlice.ts.
//
// Deliberately NOT translated here:
// - PRIVACY_POLICY_SECTIONS / TERMS_SECTIONS (content/legalContent.ts) — legal
//   text should go through professional/legal translation review before it
//   ships per-market, not machine translation. They stay English-only.
// - The Contact Us diagnostic email body — it's addressed to a specific
//   English-reading recipient (see utils/contactMail.ts).
// - "piercer.ai" itself — brand name, not translated.
//
// Also out of scope: RTL layout mirroring for Arabic/Urdu. Text renders
// translated but the layout direction does not flip — a follow-up would
// need I18nManager.forceRTL plus a full layout pass.

export type LanguageCode = 'en' | 'zh' | 'hi' | 'es' | 'fr' | 'ar' | 'bn' | 'pt' | 'ru' | 'ur';

type TranslationKey = keyof typeof translations;

export const translations = {
  'nav.capture': {
    en: 'Capture', zh: 'Capture', hi: 'Capture', es: 'Capture', fr: 'Capture',
    ar: 'Capture', bn: 'Capture', pt: 'Capture', ru: 'Capture', ur: 'Capture',
  },
  'nav.settings': {
    en: 'Settings', zh: '设置', hi: 'सेटिंग्स', es: 'Ajustes', fr: 'Paramètres',
    ar: 'الإعدادات', bn: 'সেটিংস', pt: 'Definições', ru: 'Настройки', ur: 'ترتیبات',
  },
  'disclaimer.text': {
    en: 'For entertainment purposes only. piercer.ai does not provide clinical, psychological, or diagnostic assessments. Photos are processed in memory and never stored.',
    zh: '仅供娱乐使用。piercer.ai 不提供任何临床、心理或诊断评估。照片仅在内存中处理，绝不会被存储。',
    hi: 'केवल मनोरंजन हेतु। piercer.ai कोई नैदानिक, मनोवैज्ञानिक या डायग्नोस्टिक मूल्यांकन प्रदान नहीं करता। फ़ोटो केवल मेमोरी में प्रोसेस होती हैं और कभी संग्रहीत नहीं की जातीं।',
    es: 'Solo con fines de entretenimiento. piercer.ai no ofrece evaluaciones clínicas, psicológicas ni de diagnóstico. Las fotos se procesan en memoria y nunca se almacenan.',
    fr: 'À des fins de divertissement uniquement. piercer.ai ne fournit aucune évaluation clinique, psychologique ou diagnostique. Les photos sont traitées en mémoire et ne sont jamais stockées.',
    ar: 'لأغراض الترفيه فقط. لا يقدم piercer.ai أي تقييمات سريرية أو نفسية أو تشخيصية. تتم معالجة الصور في الذاكرة فقط ولا يتم تخزينها أبدًا.',
    bn: 'শুধুমাত্র বিনোদনের উদ্দেশ্যে। piercer.ai কোনো ক্লিনিক্যাল, মনস্তাত্ত্বিক বা রোগনির্ণয়মূলক মূল্যায়ন প্রদান করে না। ছবিগুলো শুধু মেমোরিতে প্রক্রিয়া করা হয় এবং কখনো সংরক্ষণ করা হয় না।',
    pt: 'Apenas para fins de entretenimento. O piercer.ai não fornece avaliações clínicas, psicológicas ou de diagnóstico. As fotos são processadas na memória e nunca armazenadas.',
    ru: 'Только в развлекательных целях. piercer.ai не предоставляет клинических, психологических или диагностических заключений. Фото обрабатываются только в памяти и никогда не сохраняются.',
    ur: 'صرف تفریحی مقاصد کے لیے۔ piercer.ai کوئی طبی، نفسیاتی یا تشخیصی جائزہ فراہم نہیں کرتا۔ تصاویر صرف میموری میں پروسیس ہوتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔',
  },
  'onboarding.step0.headline': {
    en: 'Welcome to piercer.ai', zh: 'Welcome to piercer.ai', hi: 'Welcome to piercer.ai',
    es: 'Welcome to piercer.ai', fr: 'Welcome to piercer.ai',
    ar: 'Welcome to piercer.ai', bn: 'Welcome to piercer.ai', pt: 'Welcome to piercer.ai',
    ru: 'Welcome to piercer.ai', ur: 'Welcome to piercer.ai',
  },
  'onboarding.step0.body': {
    en: 'Take a photo and preview how new piercing jewelry could look on you.',
    zh: 'Take a photo and preview how new piercing jewelry could look on you.',
    hi: 'Take a photo and preview how new piercing jewelry could look on you.',
    es: 'Take a photo and preview how new piercing jewelry could look on you.',
    fr: 'Take a photo and preview how new piercing jewelry could look on you.',
    ar: 'Take a photo and preview how new piercing jewelry could look on you.',
    bn: 'Take a photo and preview how new piercing jewelry could look on you.',
    pt: 'Take a photo and preview how new piercing jewelry could look on you.',
    ru: 'Take a photo and preview how new piercing jewelry could look on you.',
    ur: 'Take a photo and preview how new piercing jewelry could look on you.',
  },
  'onboarding.step1.headline': {
    en: 'Before We Begin', zh: '开始之前', hi: 'शुरू करने से पहले', es: 'Antes de empezar', fr: 'Avant de commencer',
    ar: 'قبل أن نبدأ', bn: 'শুরু করার আগে', pt: 'Antes de começar', ru: 'Прежде чем начать', ur: 'شروع کرنے سے پہلے',
  },
  'onboarding.step1.body': {
    en: 'Your photos are analyzed instantly and never stored. This is for entertainment only.',
    zh: '你的照片会被即时分析，绝不会被存储。本应用仅供娱乐使用。',
    hi: 'आपकी फ़ोटो तुरंत विश्लेषित होती हैं और कभी संग्रहीत नहीं होतीं। यह केवल मनोरंजन हेतु है।',
    es: 'Tus fotos se analizan al instante y nunca se almacenan. Esto es solo para entretenimiento.',
    fr: 'Vos photos sont analysées instantanément et ne sont jamais stockées. Ceci est uniquement pour le divertissement.',
    ar: 'يتم تحليل صورك فورًا ولا يتم تخزينها أبدًا. هذا لأغراض الترفيه فقط.',
    bn: 'আপনার ছবি তাৎক্ষণিকভাবে বিশ্লেষণ করা হয় এবং কখনো সংরক্ষণ করা হয় না। এটি শুধুমাত্র বিনোদনের জন্য।',
    pt: 'As suas fotos são analisadas instantaneamente e nunca armazenadas. Isto é apenas para entretenimento.',
    ru: 'Ваши фото анализируются мгновенно и никогда не сохраняются. Это только для развлечения.',
    ur: 'آپ کی تصاویر فوری طور پر تجزیہ کی جاتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔ یہ صرف تفریح کے لیے ہے۔',
  },
  'onboarding.ageCheckbox': {
    en: 'I confirm I am 18 years of age or older.', zh: '我确认我已年满18周岁。', hi: 'मैं पुष्टि करता/करती हूं कि मेरी आयु 18 वर्ष या उससे अधिक है।',
    es: 'Confirmo que tengo 18 años de edad o más.', fr: "Je confirme avoir 18 ans ou plus.",
    ar: 'أؤكد أن عمري 18 عامًا أو أكثر.', bn: 'আমি নিশ্চিত করছি যে আমার বয়স ১৮ বছর বা তার বেশি।', pt: 'Confirmo que tenho 18 anos ou mais.',
    ru: 'Я подтверждаю, что мне 18 лет или больше.', ur: 'میں تصدیق کرتا/کرتی ہوں کہ میری عمر 18 سال یا اس سے زیادہ ہے۔',
  },
  'onboarding.consentCheckbox': {
    en: 'I consent to my photos being processed for this entertainment reading.',
    zh: '我同意我的照片被用于此娱乐性解读的处理。',
    hi: 'मैं इस मनोरंजन रीडिंग हेतु अपनी फ़ोटो प्रोसेस किए जाने के लिए सहमति देता/देती हूं।',
    es: 'Doy mi consentimiento para que mis fotos sean procesadas para esta lectura de entretenimiento.',
    fr: 'Je consens à ce que mes photos soient traitées pour cette lecture de divertissement.',
    ar: 'أوافق على معالجة صوري لهذه القراءة الترفيهية.',
    bn: 'আমি এই বিনোদনমূলক রিডিংয়ের জন্য আমার ছবি প্রক্রিয়া করার সম্মতি দিচ্ছি।',
    pt: 'Consinto que as minhas fotos sejam processadas para esta leitura de entretenimento.',
    ru: 'Я даю согласие на обработку моих фото для этого развлекательного анализа.',
    ur: 'میں اس تفریحی ریڈنگ کے لیے اپنی تصاویر پروسیس کیے جانے کی رضامندی دیتا/دیتی ہوں۔',
  },
  'onboarding.privacyLink': {
    en: 'Read our Privacy Policy', zh: '阅读我们的隐私政策', hi: 'हमारी गोपनीयता नीति पढ़ें', es: 'Lee nuestra Política de Privacidad',
    fr: 'Lire notre politique de confidentialité', ar: 'اقرأ سياسة الخصوصية الخاصة بنا', bn: 'আমাদের গোপনীয়তা নীতি পড়ুন',
    pt: 'Leia a nossa Política de Privacidade', ru: 'Прочитать нашу политику конфиденциальности', ur: 'ہماری پرائیویسی پالیسی پڑھیں',
  },
  'onboarding.next': {
    en: 'Next', zh: '下一步', hi: 'अगला', es: 'Siguiente', fr: 'Suivant', ar: 'التالي', bn: 'পরবর্তী', pt: 'Seguinte', ru: 'Далее', ur: 'اگلا',
  },
  'onboarding.getStarted': {
    en: 'Get Started', zh: '开始使用', hi: 'शुरू करें', es: 'Comenzar', fr: 'Commencer', ar: 'ابدأ الآن',
    bn: 'শুরু করুন', pt: 'Começar', ru: 'Начать', ur: 'شروع کریں',
  },
  'capture.permission.headline': {
    en: 'Camera Access Needed', zh: '需要相机权限', hi: 'कैमरा एक्सेस आवश्यक है', es: 'Se necesita acceso a la cámara',
    fr: "Accès à la caméra requis", ar: 'يلزم الوصول إلى الكاميرا', bn: 'ক্যামেরা অ্যাক্সেস প্রয়োজন', pt: 'Acesso à câmara necessário',
    ru: 'Требуется доступ к камере', ur: 'کیمرے تک رسائی درکار ہے',
  },
  'capture.permission.body': {
    en: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
    zh: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
    hi: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
    es: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
    fr: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
    ar: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
    bn: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
    pt: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
    ru: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
    ur: 'piercer.ai needs your camera to capture your photos. Photos are processed in memory and never stored.',
  },
  'capture.permission.button': {
    en: 'Allow Camera Access', zh: '允许访问相机', hi: 'कैमरा एक्सेस की अनुमति दें', es: 'Permitir acceso a la cámara',
    fr: "Autoriser l'accès à la caméra", ar: 'السماح بالوصول إلى الكاميرا', bn: 'ক্যামেরা অ্যাক্সেসের অনুমতি দিন', pt: 'Permitir acesso à câmara',
    ru: 'Разрешить доступ к камере', ur: 'کیمرے کی رسائی کی اجازت دیں',
  },
  'capture.error.title': {
    en: 'Capture Failed', zh: '拍摄失败', hi: 'कैप्चर विफल', es: 'Error al capturar', fr: 'Échec de la capture',
    ar: 'فشل الالتقاط', bn: 'ক্যাপচার ব্যর্থ হয়েছে', pt: 'Falha na captura', ru: 'Не удалось сделать снимок',
    ur: 'کیپچر ناکام ہوگیا',
  },
  'capture.error.body': {
    en: 'Something went wrong taking that photo. Please try again.',
    zh: '拍摄照片时出了点问题，请重试。',
    hi: 'वह फ़ोटो लेने में कुछ गड़बड़ हुई। कृपया फिर से कोशिश करें।',
    es: 'Algo salió mal al tomar esa foto. Inténtalo de nuevo.',
    fr: "Une erreur s'est produite lors de la prise de cette photo. Veuillez réessayer.",
    ar: 'حدث خطأ أثناء التقاط هذه الصورة. يُرجى المحاولة مرة أخرى.',
    bn: 'সেই ছবিটি তোলার সময় কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
    pt: 'Algo correu mal ao tirar essa foto. Por favor, tente novamente.',
    ru: 'При съёмке этого фото что-то пошло не так. Пожалуйста, попробуйте ещё раз.',
    ur: 'وہ تصویر لینے میں کچھ گڑبڑ ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
  },
  'capture.chooseFromLibrary': {
    en: 'Choose from Library', zh: '从相册选择', hi: 'लाइब्रेरी से चुनें', es: 'Elegir de la galería',
    fr: 'Choisir depuis la galerie', ar: 'اختر من المكتبة', bn: 'লাইব্রেরি থেকে বেছে নিন', pt: 'Escolher da galeria',
    ru: 'Выбрать из галереи', ur: 'لائبریری سے منتخب کریں',
  },
  'capture.libraryPermission.title': {
    en: 'Photo Access Needed', zh: '需要相册权限', hi: 'फ़ोटो एक्सेस आवश्यक है', es: 'Se necesita acceso a las fotos',
    fr: 'Accès aux photos requis', ar: 'يلزم الوصول إلى الصور', bn: 'ফটো অ্যাক্সেস প্রয়োজন', pt: 'Acesso a fotos necessário',
    ru: 'Требуется доступ к фото', ur: 'تصاویر تک رسائی درکار ہے',
  },
  'capture.libraryPermission.body': {
    en: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
    zh: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
    hi: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
    es: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
    fr: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
    ar: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
    bn: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
    pt: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
    ru: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
    ur: 'piercer.ai needs access to your photo library to use an existing photo. Photos are processed in memory and never stored.',
  },
  'capture.cancelButton': {
    en: 'Cancel', zh: '取消', hi: 'रद्द करें', es: 'Cancelar', fr: 'Annuler', ar: 'إلغاء', bn: 'বাতিল করুন',
    pt: 'Cancelar', ru: 'Отмена', ur: 'منسوخ کریں',
  },
  'paywall.headline': {
    en: 'Unlock Full AI Face Insights', zh: '解锁完整 AI 面部洞察', hi: 'पूर्ण AI फेस इनसाइट्स अनलॉक करें',
    es: 'Desbloquea todos los análisis faciales con IA', fr: 'Débloquez toutes les analyses faciales par IA',
    ar: 'افتح رؤى الوجه الكاملة بالذكاء الاصطناعي', bn: 'সম্পূর্ণ AI ফেস ইনসাইট আনলক করুন', pt: 'Desbloqueie todas as análises faciais com IA',
    ru: 'Откройте полный ИИ-анализ лица', ur: 'مکمل AI فیس بصیرت اَن لاک کریں',
  },
  'paywall.subtitle': {
    en: 'Experience unlimited AI piercing renders and jewelry previews, unlocked instantly.',
    zh: '体验无限次 AI 穿孔效果渲染与首饰预览，即刻解锁。',
    hi: 'असीमित AI पियर्सिंग रेंडर और ज्वेलरी प्रीव्यू का अनुभव करें, तुरंत अनलॉक।',
    es: 'Disfruta de renderizados de piercings con IA ilimitados y vistas previas de joyería, desbloqueados al instante.',
    fr: "Profitez de rendus de piercing par IA illimités et d'aperçus de bijoux, débloqués instantanément.",
    ar: 'استمتع بعمليات محاكاة غير محدودة للثقب بالذكاء الاصطناعي ومعاينات للمجوهرات، تُفتح فورًا.',
    bn: 'সীমাহীন AI পিয়ার্সিং রেন্ডার ও জুয়েলারি প্রিভিউ উপভোগ করুন, তাৎক্ষণিকভাবে আনলক।',
    pt: 'Desfrute de renderizações de piercings com IA ilimitadas e pré-visualizações de joias, desbloqueadas instantaneamente.',
    ru: 'Получите неограниченный ИИ-рендеринг пирсинга и предпросмотр украшений — разблокировано мгновенно.',
    ur: 'لامحدود AI پیئرسنگ رینڈرز اور جیولری پریویوز سے لطف اندوز ہوں، فوری اَن لاک۔',
  },
  'paywall.featuresHeading': {
    en: 'Everything you unlock', zh: '解锁全部权益', hi: 'आपको जो कुछ मिलेगा', es: 'Todo lo que desbloqueas',
    fr: 'Tout ce que vous débloquez', ar: 'كل ما ستحصل عليه', bn: 'আপনি যা যা আনলক করবেন', pt: 'Tudo o que desbloqueia',
    ru: 'Всё, что вы получите', ur: 'وہ سب کچھ جو آپ کو ملے گا',
  },
  'paywall.feature1': {
    en: 'Unlimited AI Readings — Character, Relationship & Career', zh: '无限次 AI 解读——性格、关系与职业',
    hi: 'असीमित AI रीडिंग — कैरेक्टर, रिलेशनशिप और करियर', es: 'Lecturas con IA ilimitadas: carácter, relación y carrera',
    fr: 'Lectures par IA illimitées : caractère, relation et carrière', ar: 'قراءات غير محدودة بالذكاء الاصطناعي — الشخصية والعلاقة والمسار المهني',
    bn: 'সীমাহীন AI রিডিং — ক্যারেক্টার, রিলেশনশিপ ও ক্যারিয়ার', pt: 'Leituras com IA ilimitadas: caráter, relacionamento e carreira',
    ru: 'Неограниченные ИИ-анализы — характер, отношения и карьера', ur: 'لامحدود AI ریڈنگز — کریکٹر، ریلیشن شپ اور کیریئر',
  },
  'paywall.feature2': {
    en: 'Rich Personality & Vibe Reports, Every Time', zh: '每次都有丰富的性格与氛围报告', hi: 'हर बार समृद्ध व्यक्तित्व और वाइब रिपोर्ट',
    es: 'Informes ricos de personalidad y vibra en cada lectura', fr: 'Des rapports riches de personnalité et de vibe à chaque fois',
    ar: 'تقارير غنية عن الشخصية والطاقة في كل مرة', bn: 'প্রতিবারই সমৃদ্ধ ব্যক্তিত্ব ও ভাইব রিপোর্ট', pt: 'Relatórios ricos de personalidade e vibe, sempre',
    ru: 'Насыщенные отчёты о личности и атмосфере — каждый раз', ur: 'ہر بار بھرپور شخصیت اور وائب رپورٹس',
  },
  'paywall.feature3': {
    en: 'Instant High-Res, Story-Ready Share Cards', zh: '即时生成高清故事分享卡',
    hi: 'तुरंत हाई-रेस, स्टोरी-रेडी शेयर कार्ड्स', es: 'Tarjetas para compartir en alta resolución, listas al instante',
    fr: "Cartes de partage haute résolution, prêtes instantanément", ar: 'بطاقات مشاركة عالية الدقة وجاهزة للستوري فورًا',
    bn: 'তাৎক্ষণিক হাই-রেজোলিউশন, স্টোরি-রেডি শেয়ার কার্ড', pt: 'Cartões de partilha em alta resolução, prontos na hora',
    ru: 'Карточки для сторис в высоком разрешении — мгновенно готовы', ur: 'فوری ہائی ریزولوشن، اسٹوری کے لیے تیار شیئر کارڈز',
  },
  'paywall.mostPopular': {
    en: 'MOST POPULAR', zh: '最受欢迎', hi: 'सबसे लोकप्रिय', es: 'MÁS POPULAR', fr: 'LE PLUS POPULAIRE',
    ar: 'الأكثر شيوعًا', bn: 'সবচেয়ে জনপ্রিয়', pt: 'MAIS POPULAR', ru: 'САМЫЙ ПОПУЛЯРНЫЙ', ur: 'سب سے مقبول',
  },
  'paywall.weeklyName': {
    en: 'Weekly Pass', zh: '每周订阅', hi: 'साप्ताहिक पास', es: 'Pase semanal', fr: 'Pass hebdomadaire',
    ar: 'اشتراك أسبوعي', bn: 'সাপ্তাহিক পাস', pt: 'Passe semanal', ru: 'Недельный абонемент', ur: 'ہفتہ وار پاس',
  },
  'paywall.weeklyDescription': {
    en: 'Full access, billed weekly', zh: '完全权限，按周计费', hi: 'पूर्ण एक्सेस, साप्ताहिक बिलिंग', es: 'Acceso completo, facturación semanal',
    fr: 'Accès complet, facturation hebdomadaire', ar: 'وصول كامل، فوترة أسبوعية', bn: 'সম্পূর্ণ অ্যাক্সেস, সাপ্তাহিক বিলিং', pt: 'Acesso total, faturação semanal',
    ru: 'Полный доступ, еженедельная оплата', ur: 'مکمل رسائی، ہفتہ وار بلنگ',
  },
  'paywall.weeklyCadence': {
    en: '/WEEK', zh: '/周', hi: '/सप्ताह', es: '/SEMANA', fr: '/SEMAINE',
    ar: '/أسبوعيًا', bn: '/সপ্তাহ', pt: '/SEMANA', ru: '/НЕДЕЛЮ', ur: '/ہفتہ',
  },
  'paywall.subscribeNow': {
    en: 'Subscribe Now', zh: '立即订阅', hi: 'अभी सब्सक्राइब करें', es: 'Suscribirse ahora', fr: "S'abonner maintenant",
    ar: 'اشترك الآن', bn: 'এখনই সাবস্ক্রাইব করুন', pt: 'Subscrever agora', ru: 'Оформить подписку', ur: 'ابھی سبسکرائب کریں',
  },
  'paywall.reassurance': {
    en: 'Cancel anytime · Secure payment', zh: '随时取消 · 安全支付', hi: 'कभी भी रद्द करें · सुरक्षित भुगतान',
    es: 'Cancela cuando quieras · Pago seguro', fr: 'Annulez à tout moment · Paiement sécurisé',
    ar: 'ألغِ في أي وقت · دفع آمن', bn: 'যেকোনো সময় বাতিল করুন · নিরাপদ পেমেন্ট', pt: 'Cancele quando quiser · Pagamento seguro',
    ru: 'Отмена в любой момент · Безопасная оплата', ur: 'کسی بھی وقت منسوخ کریں · محفوظ ادائیگی',
  },
  'paywall.monthlyName': {
    en: 'Monthly Pass', zh: '月度订阅', hi: 'मासिक पास', es: 'Pase mensual', fr: 'Pass mensuel', ar: 'اشتراك شهري',
    bn: 'মাসিক পাস', pt: 'Passe mensal', ru: 'Месячный абонемент', ur: 'ماہانہ پاس',
  },
  'paywall.saveBadge': {
    en: 'SAVE 50%', zh: '节省50%', hi: '50% बचाएं', es: 'AHORRA 50%', fr: 'ÉCONOMISEZ 50%', ar: 'وفّر 50٪',
    bn: '৫০% সাশ্রয়', pt: 'POUPE 50%', ru: 'ЭКОНОМИЯ 50%', ur: '50% کی بچت',
  },
  'paywall.monthlyDescription': {
    en: 'Best value for regulars', zh: '常客的最佳选择', hi: 'नियमित उपयोगकर्ताओं के लिए सबसे अच्छा मूल्य', es: 'La mejor relación calidad-precio',
    fr: 'Le meilleur rapport qualité-prix', ar: 'أفضل قيمة للمستخدمين المنتظمين', bn: 'নিয়মিত ব্যবহারকারীদের জন্য সেরা মূল্য', pt: 'Melhor valor para uso regular',
    ru: 'Лучшая цена для постоянных пользователей', ur: 'باقاعدہ صارفین کے لیے بہترین قیمت',
  },
  'paywall.monthlyCadence': {
    en: '/MONTH', zh: '/月', hi: '/माह', es: '/MES', fr: '/MOIS', ar: '/شهريًا',
    bn: '/মাস', pt: '/MÊS', ru: '/МЕС', ur: '/ماہ',
  },
  'paywall.startTrial': {
    en: 'Start Free Trial', zh: '开始免费试用', hi: 'निःशुल्क ट्रायल शुरू करें', es: 'Iniciar prueba gratuita', fr: "Démarrer l'essai gratuit",
    ar: 'ابدأ التجربة المجانية', bn: 'বিনামূল্যে ট্রায়াল শুরু করুন', pt: 'Iniciar teste gratuito', ru: 'Начать бесплатный период', ur: 'مفت ٹرائل شروع کریں',
  },
  'paywall.restorePurchases': {
    en: 'Restore Purchases', zh: '恢复购买', hi: 'खरीदारी पुनर्स्थापित करें', es: 'Restaurar compras', fr: 'Restaurer les achats',
    ar: 'استعادة المشتريات', bn: 'ক্রয় পুনরুদ্ধার করুন', pt: 'Restaurar compras', ru: 'Восстановить покупки', ur: 'خریداری بحال کریں',
  },
  'paywall.termsOfService': {
    en: 'Terms of Service', zh: '服务条款', hi: 'सेवा की शर्तें', es: 'Términos del servicio', fr: 'Conditions de service',
    ar: 'شروط الخدمة', bn: 'পরিষেবার শর্তাবলী', pt: 'Termos de serviço', ru: 'Условия использования', ur: 'شرائط خدمت',
  },
  'paywall.privacyPolicy': {
    en: 'Privacy Policy', zh: '隐私政策', hi: 'गोपनीयता नीति', es: 'Política de privacidad', fr: 'Politique de confidentialité',
    ar: 'سياسة الخصوصية', bn: 'গোপনীয়তা নীতি', pt: 'Política de privacidade', ru: 'Политика конфиденциальности', ur: 'پرائیویسی پالیسی',
  },
  'paywall.purchaseError.title': {
    en: 'Purchase Failed', zh: '购买失败', hi: 'खरीदारी विफल', es: 'Compra fallida', fr: "Échec de l'achat",
    ar: 'فشل الشراء', bn: 'ক্রয় ব্যর্থ হয়েছে', pt: 'Compra falhou', ru: 'Покупка не удалась', ur: 'خریداری ناکام',
  },
  'paywall.purchaseError.body': {
    en: 'Something went wrong with your purchase. Please try again.', zh: '购买时出现问题，请重试。',
    hi: 'आपकी खरीदारी में कुछ गड़बड़ हुई। कृपया पुनः प्रयास करें।', es: 'Algo salió mal con tu compra. Inténtalo de nuevo.',
    fr: 'Un problème est survenu avec votre achat. Veuillez réessayer.', ar: 'حدث خطأ أثناء الشراء. يرجى المحاولة مرة أخرى.',
    bn: 'আপনার ক্রয়ে কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', pt: 'Algo correu mal com a sua compra. Por favor, tente novamente.',
    ru: 'Что-то пошло не так с вашей покупкой. Пожалуйста, попробуйте снова.', ur: 'آپ کی خریداری میں کچھ گڑبڑ ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
  },
  'paywall.restoreSuccess.body': {
    en: 'Your subscription has been restored.', zh: '您的订阅已恢复。', hi: 'आपकी सदस्यता पुनर्स्थापित कर दी गई है।',
    es: 'Tu suscripción ha sido restaurada.', fr: 'Votre abonnement a été restauré.', ar: 'تمت استعادة اشتراكك.',
    bn: 'আপনার সাবস্ক্রিপশন পুনরুদ্ধার করা হয়েছে।', pt: 'A sua subscrição foi restaurada.', ru: 'Ваша подписка восстановлена.',
    ur: 'آپ کی سبسکرپشن بحال کر دی گئی ہے۔',
  },
  'settings.title': {
    en: 'Settings', zh: '设置', hi: 'सेटिंग्स', es: 'Ajustes', fr: 'Paramètres', ar: 'الإعدادات', bn: 'সেটিংস',
    pt: 'Definições', ru: 'Настройки', ur: 'ترتیبات',
  },
  'settings.section.subscription': {
    en: 'Subscription', zh: '订阅', hi: 'सब्सक्रिप्शन', es: 'Suscripción', fr: 'Abonnement', ar: 'الاشتراك',
    bn: 'সাবস্ক্রিপশন', pt: 'Subscrição', ru: 'Подписка', ur: 'سبسکرپشن',
  },
  'settings.section.general': {
    en: 'General', zh: '通用', hi: 'सामान्य', es: 'General', fr: 'Général', ar: 'عام', bn: 'সাধারণ',
    pt: 'Geral', ru: 'Общее', ur: 'عام',
  },
  'settings.section.legal': {
    en: 'Legal', zh: '法律', hi: 'कानूनी', es: 'Legal', fr: 'Mentions légales', ar: 'قانوني', bn: 'আইনি',
    pt: 'Legal', ru: 'Правовая информация', ur: 'قانونی',
  },
  'settings.row.manageSubscription': {
    en: 'Manage Subscription', zh: '管理订阅', hi: 'सब्सक्रिप्शन प्रबंधित करें', es: 'Gestionar suscripción', fr: "Gérer l'abonnement",
    ar: 'إدارة الاشتراك', bn: 'সাবস্ক্রিপশন পরিচালনা করুন', pt: 'Gerir subscrição', ru: 'Управление подпиской', ur: 'سبسکرپشن کا نظم کریں',
  },
  'settings.row.restorePurchases': {
    en: 'Restore Purchases', zh: '恢复购买', hi: 'खरीदारी पुनर्स्थापित करें', es: 'Restaurar compras', fr: 'Restaurer les achats',
    ar: 'استعادة المشتريات', bn: 'ক্রয় পুনরুদ্ধার করুন', pt: 'Restaurar compras', ru: 'Восстановить покупки', ur: 'خریداری بحال کریں',
  },
  'settings.row.language': {
    en: 'Language', zh: '语言', hi: 'भाषा', es: 'Idioma', fr: 'Langue', ar: 'اللغة', bn: 'ভাষা', pt: 'Idioma', ru: 'Язык', ur: 'زبان',
  },
  'settings.row.rateUs': {
    en: 'Rate Us', zh: '给我们评分', hi: 'हमें रेट करें', es: 'Califícanos', fr: 'Notez-nous', ar: 'قيّمنا', bn: 'আমাদের রেট করুন',
    pt: 'Avalie-nos', ru: 'Оцените нас', ur: 'ہمیں ریٹ کریں',
  },
  'settings.row.shareApp': {
    en: 'Share App', zh: '分享应用', hi: 'ऐप शेयर करें', es: 'Compartir app', fr: "Partager l'application", ar: 'مشاركة التطبيق',
    bn: 'অ্যাপ শেয়ার করুন', pt: 'Partilhar app', ru: 'Поделиться приложением', ur: 'ایپ شیئر کریں',
  },
  'settings.row.privacyPolicy': {
    en: 'Privacy Policy', zh: '隐私政策', hi: 'गोपनीयता नीति', es: 'Política de privacidad', fr: 'Politique de confidentialité',
    ar: 'سياسة الخصوصية', bn: 'গোপনীয়তা নীতি', pt: 'Política de privacidade', ru: 'Политика конфиденциальности', ur: 'پرائیویسی پالیسی',
  },
  'settings.row.termsConditions': {
    en: 'Terms & Conditions', zh: '条款与条件', hi: 'नियम व शर्तें', es: 'Términos y condiciones', fr: 'Conditions générales',
    ar: 'الشروط والأحكام', bn: 'শর্তাবলী', pt: 'Termos e condições', ru: 'Условия использования', ur: 'شرائط و ضوابط',
  },
  'settings.row.contactUs': {
    en: 'Contact Us', zh: '联系我们', hi: 'हमसे संपर्क करें', es: 'Contáctanos', fr: 'Nous contacter', ar: 'اتصل بنا',
    bn: 'যোগাযোগ করুন', pt: 'Contacte-nos', ru: 'Связаться с нами', ur: 'ہم سے رابطہ کریں',
  },
  'settings.section.about': {
    en: 'About', zh: '关于', hi: 'के बारे में', es: 'Acerca de', fr: 'À propos', ar: 'حول', bn: 'সম্পর্কে',
    pt: 'Sobre', ru: 'О приложении', ur: 'کے بارے میں',
  },
  'settings.row.appVersion': {
    en: 'App Version', zh: '应用版本', hi: 'ऐप संस्करण', es: 'Versión de la app', fr: "Version de l'application",
    ar: 'إصدار التطبيق', bn: 'অ্যাপ সংস্করণ', pt: 'Versão da app', ru: 'Версия приложения', ur: 'ایپ ورژن',
  },
  'settings.row.device': {
    en: 'Device', zh: '设备', hi: 'डिवाइस', es: 'Dispositivo', fr: 'Appareil', ar: 'الجهاز', bn: 'ডিভাইস',
    pt: 'Dispositivo', ru: 'Устройство', ur: 'ڈیوائس',
  },
  'welcome.headline': {
    en: "You're All Set", zh: '一切准备就绪', hi: 'आप तैयार हैं', es: 'Todo listo', fr: 'Vous êtes prêt',
    ar: 'أنت جاهز الآن', bn: 'আপনি প্রস্তুত', pt: 'Está tudo pronto', ru: 'Всё готово', ur: 'آپ تیار ہیں',
  },
  'welcome.subtitle': {
    en: "Capture your first photo whenever you're ready.",
    zh: "Capture your first photo whenever you're ready.",
    hi: "Capture your first photo whenever you're ready.",
    es: "Capture your first photo whenever you're ready.",
    fr: "Capture your first photo whenever you're ready.",
    ar: "Capture your first photo whenever you're ready.",
    bn: "Capture your first photo whenever you're ready.",
    pt: "Capture your first photo whenever you're ready.",
    ru: "Capture your first photo whenever you're ready.",
    ur: "Capture your first photo whenever you're ready.",
  },
  'welcome.cta': {
    en: "Let's Go", zh: '开始吧', hi: 'चलिए शुरू करें', es: 'Vamos', fr: 'Allons-y', ar: 'هيا بنا',
    bn: 'চলুন শুরু করি', pt: 'Vamos lá', ru: 'Поехали', ur: 'چلیں شروع کریں',
  },
  'common.close': {
    en: 'Close', zh: '关闭', hi: 'बंद करें', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق', bn: 'বন্ধ করুন', pt: 'Fechar', ru: 'Закрыть', ur: 'بند کریں',
  },
  'studio.title': {
    en: 'Piercing Studio', zh: '穿孔工作室', hi: 'पियर्सिंग स्टूडियो', es: 'Estudio de piercing',
    fr: 'Studio de piercing', ar: 'استوديو الثقب', bn: 'পিয়ার্সিং স্টুডিও', pt: 'Estúdio de piercing',
    ru: 'Студия пирсинга', ur: 'پیئرسنگ اسٹوڈیو',
  },
  'studio.subtitle': {
    en: 'Pick a jewelry style and finish to preview on your photo.',
    zh: 'Pick a jewelry style and finish to preview on your photo.',
    hi: 'Pick a jewelry style and finish to preview on your photo.',
    es: 'Pick a jewelry style and finish to preview on your photo.',
    fr: 'Pick a jewelry style and finish to preview on your photo.',
    ar: 'Pick a jewelry style and finish to preview on your photo.',
    bn: 'Pick a jewelry style and finish to preview on your photo.',
    pt: 'Pick a jewelry style and finish to preview on your photo.',
    ru: 'Pick a jewelry style and finish to preview on your photo.',
    ur: 'Pick a jewelry style and finish to preview on your photo.',
  },
  'studio.jewelryType.heading': {
    en: 'Jewelry Type', zh: '首饰类型', hi: 'ज्वेलरी प्रकार', es: 'Tipo de joyería', fr: 'Type de bijou',
    ar: 'نوع المجوهرات', bn: 'জুয়েলারি ধরন', pt: 'Tipo de joia', ru: 'Тип украшения', ur: 'زیورات کی قسم',
  },
  'studio.finish.heading': {
    en: 'Finish', zh: '材质', hi: 'फिनिश', es: 'Acabado', fr: 'Finition', ar: 'التشطيب', bn: 'ফিনিশ',
    pt: 'Acabamento', ru: 'Отделка', ur: 'فنش',
  },
  'studio.jewelry.hoops': {
    en: 'Hoops', zh: '圈环', hi: 'हूप्स', es: 'Aros', fr: 'Anneaux', ar: 'حلقات', bn: 'হুপস',
    pt: 'Argolas', ru: 'Кольца', ur: 'ہوپس',
  },
  'studio.jewelry.studs': {
    en: 'Studs', zh: '钉饰', hi: 'स्टड्स', es: 'Tachuelas', fr: 'Puces', ar: 'أقراط ثابتة', bn: 'স্টাডস',
    pt: 'Brincos de pressão', ru: 'Гвоздики', ur: 'اسٹڈز',
  },
  'studio.jewelry.barbells': {
    en: 'Barbells', zh: '哑铃钉', hi: 'बारबेल्स', es: 'Barras', fr: 'Barbells', ar: 'بارابل', bn: 'বারবেল',
    pt: 'Barbells', ru: 'Штанги', ur: 'باربیلز',
  },
  'studio.jewelry.industrial': {
    en: 'Industrial', zh: '工业钉', hi: 'इंडस्ट्रियल', es: 'Industrial', fr: 'Industriel', ar: 'صناعي',
    bn: 'ইন্ডাস্ট্রিয়াল', pt: 'Industrial', ru: 'Индастриал', ur: 'انڈسٹریل',
  },
  'studio.jewelry.septum': {
    en: 'Septum', zh: '鼻中隔环', hi: 'सेप्टम', es: 'Septum', fr: 'Septum', ar: 'حاجز الأنف', bn: 'সেপটাম',
    pt: 'Septo', ru: 'Септум', ur: 'سیپٹم',
  },
  'studio.jewelry.dermal': {
    en: 'Dermal', zh: '真皮钉', hi: 'डर्मल', es: 'Dérmico', fr: 'Dermal', ar: 'جلدي', bn: 'ডার্মাল',
    pt: 'Dérmico', ru: 'Дермал', ur: 'ڈرمل',
  },
  'studio.finish.silver': {
    en: 'Silver', zh: '银色', hi: 'सिल्वर', es: 'Plata', fr: 'Argent', ar: 'فضي', bn: 'সিলভার',
    pt: 'Prateado', ru: 'Серебро', ur: 'چاندی',
  },
  'studio.finish.gold': {
    en: 'Gold', zh: '金色', hi: 'गोल्ड', es: 'Oro', fr: 'Or', ar: 'ذهبي', bn: 'গোল্ড', pt: 'Dourado',
    ru: 'Золото', ur: 'سونا',
  },
  'studio.finish.titanium': {
    en: 'Titanium', zh: '钛金属', hi: 'टाइटेनियम', es: 'Titanio', fr: 'Titane', ar: 'تيتانيوم', bn: 'টাইটানিয়াম',
    pt: 'Titânio', ru: 'Титан', ur: 'ٹائٹینیم',
  },
  'studio.finish.blackSteel': {
    en: 'Black Steel', zh: '黑钢', hi: 'ब्लैक स्टील', es: 'Acero negro', fr: 'Acier noir', ar: 'فولاذ أسود',
    bn: 'ব্ল্যাক স্টিল', pt: 'Aço preto', ru: 'Чёрная сталь', ur: 'بلیک اسٹیل',
  },
  'studio.continue': {
    en: 'Preview Jewelry', zh: '预览首饰', hi: 'ज्वेलरी प्रीव्यू करें', es: 'Previsualizar joyería',
    fr: 'Aperçu du bijou', ar: 'معاينة المجوهرات', bn: 'জুয়েলারি প্রিভিউ করুন', pt: 'Pré-visualizar joia',
    ru: 'Предпросмотр украшения', ur: 'جیولری پریویو کریں',
  },
  'studio.noPhoto': {
    en: 'No photo captured yet — go back and take one first.',
    zh: 'No photo captured yet — go back and take one first.',
    hi: 'No photo captured yet — go back and take one first.',
    es: 'No photo captured yet — go back and take one first.',
    fr: 'No photo captured yet — go back and take one first.',
    ar: 'No photo captured yet — go back and take one first.',
    bn: 'No photo captured yet — go back and take one first.',
    pt: 'No photo captured yet — go back and take one first.',
    ru: 'No photo captured yet — go back and take one first.',
    ur: 'No photo captured yet — go back and take one first.',
  },
  'restorePurchases.alertBody': {
    en: 'No previous purchases were found for this device.',
    zh: '未在此设备上找到先前的购买记录。',
    hi: 'इस डिवाइस के लिए कोई पिछली खरीदारी नहीं मिली।',
    es: 'No se encontraron compras anteriores para este dispositivo.',
    fr: "Aucun achat précédent n'a été trouvé pour cet appareil.",
    ar: 'لم يتم العثور على مشتريات سابقة لهذا الجهاز.',
    bn: 'এই ডিভাইসের জন্য কোনো পূর্ববর্তী ক্রয় পাওয়া যায়নি।',
    pt: 'Não foram encontradas compras anteriores para este dispositivo.',
    ru: 'Предыдущие покупки для этого устройства не найдены.',
    ur: 'اس ڈیوائس کے لیے کوئی سابقہ خریداری نہیں ملی۔',
  },
} satisfies Record<string, Record<LanguageCode, string>>;

export function translate(key: TranslationKey, languageCode: string, vars?: Record<string, string | number>): string {
  const entry = translations[key];
  const raw = entry[languageCode as LanguageCode] ?? entry.en;
  if (!vars) return raw;
  return Object.entries(vars).reduce((acc, [name, value]) => acc.replace(`{${name}}`, String(value)), raw);
}

export type { TranslationKey };
