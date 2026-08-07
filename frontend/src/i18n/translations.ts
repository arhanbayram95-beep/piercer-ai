// Translation catalog for the app's interactive UI chrome. Covers the 10
// languages listed in state/slices/localeSlice.ts.
//
// Deliberately NOT translated here:
// - PRIVACY_POLICY_SECTIONS / TERMS_SECTIONS (content/legalContent.ts) — legal
//   text should go through professional/legal translation review before it
//   ships per-market, not machine translation. They stay English-only.
// - The Contact Us diagnostic email body — it's addressed to a specific
//   English-reading recipient (see utils/contactMail.ts).
// - "Face Reader" itself — brand name, not translated.
//
// Also out of scope: RTL layout mirroring for Arabic/Urdu. Text renders
// translated but the layout direction does not flip — a follow-up would
// need I18nManager.forceRTL plus a full layout pass.

export type LanguageCode = 'en' | 'zh' | 'hi' | 'es' | 'fr' | 'ar' | 'bn' | 'pt' | 'ru' | 'ur';

type TranslationKey = keyof typeof translations;

export const translations = {
  'nav.analyze': {
    en: 'Analyze', zh: '分析', hi: 'विश्लेषण', es: 'Analizar', fr: 'Analyser',
    ar: 'تحليل', bn: 'বিশ্লেষণ', pt: 'Analisar', ru: 'Анализ', ur: 'تجزیہ',
  },
  'nav.results': {
    en: 'Results', zh: '结果', hi: 'परिणाम', es: 'Resultados', fr: 'Résultats',
    ar: 'النتائج', bn: 'ফলাফল', pt: 'Resultados', ru: 'Результаты', ur: 'نتائج',
  },
  'nav.settings': {
    en: 'Settings', zh: '设置', hi: 'सेटिंग्स', es: 'Ajustes', fr: 'Paramètres',
    ar: 'الإعدادات', bn: 'সেটিংস', pt: 'Definições', ru: 'Настройки', ur: 'ترتیبات',
  },
  'disclaimer.text': {
    en: 'For entertainment purposes only. Face Reader does not provide clinical, psychological, or diagnostic assessments. Photos are processed in memory and never stored.',
    zh: '仅供娱乐使用。Face Reader 不提供任何临床、心理或诊断评估。照片仅在内存中处理，绝不会被存储。',
    hi: 'केवल मनोरंजन हेतु। Face Reader कोई नैदानिक, मनोवैज्ञानिक या डायग्नोस्टिक मूल्यांकन प्रदान नहीं करता। फ़ोटो केवल मेमोरी में प्रोसेस होती हैं और कभी संग्रहीत नहीं की जातीं।',
    es: 'Solo con fines de entretenimiento. Face Reader no ofrece evaluaciones clínicas, psicológicas ni de diagnóstico. Las fotos se procesan en memoria y nunca se almacenan.',
    fr: 'À des fins de divertissement uniquement. Face Reader ne fournit aucune évaluation clinique, psychologique ou diagnostique. Les photos sont traitées en mémoire et ne sont jamais stockées.',
    ar: 'لأغراض الترفيه فقط. لا يقدم Face Reader أي تقييمات سريرية أو نفسية أو تشخيصية. تتم معالجة الصور في الذاكرة فقط ولا يتم تخزينها أبدًا.',
    bn: 'শুধুমাত্র বিনোদনের উদ্দেশ্যে। Face Reader কোনো ক্লিনিক্যাল, মনস্তাত্ত্বিক বা রোগনির্ণয়মূলক মূল্যায়ন প্রদান করে না। ছবিগুলো শুধু মেমোরিতে প্রক্রিয়া করা হয় এবং কখনো সংরক্ষণ করা হয় না।',
    pt: 'Apenas para fins de entretenimento. O Face Reader não fornece avaliações clínicas, psicológicas ou de diagnóstico. As fotos são processadas na memória e nunca armazenadas.',
    ru: 'Только в развлекательных целях. Face Reader не предоставляет клинических, психологических или диагностических заключений. Фото обрабатываются только в памяти и никогда не сохраняются.',
    ur: 'صرف تفریحی مقاصد کے لیے۔ Face Reader کوئی طبی، نفسیاتی یا تشخیصی جائزہ فراہم نہیں کرتا۔ تصاویر صرف میموری میں پروسیس ہوتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔',
  },
  'onboarding.step0.headline': {
    en: 'AI-Powered Expression Reading', zh: 'AI 驱动的表情解读', hi: 'AI-संचालित एक्सप्रेशन रीडिंग',
    es: 'Lectura de expresiones con IA', fr: "Lecture d'expressions par IA",
    ar: 'قراءة التعابير بالذكاء الاصطناعي', bn: 'AI-চালিত এক্সপ্রেশন রিডিং', pt: 'Leitura de expressões com IA',
    ru: 'ИИ-анализ выражений лица', ur: 'AI سے چلنے والی ایکسپریشن ریڈنگ',
  },
  'onboarding.step0.body': {
    en: 'Capture photos and let our neural matrix reveal distinct facets of your character, connections, and career vibe.',
    zh: '拍摄照片，让我们的神经矩阵揭示你性格、人际关系与职业气质的不同面向。',
    hi: 'फ़ोटो कैप्चर करें और हमारे न्यूरल मैट्रिक्स को अपने व्यक्तित्व, रिश्तों और करियर वाइब के अलग-अलग पहलू उजागर करने दें।',
    es: 'Captura fotos y deja que nuestra matriz neuronal revele facetas distintas de tu carácter, tus conexiones y tu vibra profesional.',
    fr: 'Capturez des photos et laissez notre matrice neuronale révéler des facettes distinctes de votre caractère, de vos relations et de votre vibe professionnelle.',
    ar: 'التقط صورًا ودع مصفوفتنا العصبية تكشف جوانب مميزة من شخصيتك وعلاقاتك وأجوائك المهنية.',
    bn: 'ছবি তুলুন এবং আমাদের নিউরাল ম্যাট্রিক্সকে আপনার ব্যক্তিত্ব, সম্পর্ক ও ক্যারিয়ার ভাইবের ভিন্ন দিক উন্মোচন করতে দিন।',
    pt: 'Capture fotos e deixe a nossa matriz neural revelar facetas distintas do seu caráter, das suas relações e da sua vibe profissional.',
    ru: 'Сделайте фото и позвольте нашей нейросети раскрыть разные грани вашего характера, отношений и карьерного вайба.',
    ur: 'تصاویر کیپچر کریں اور ہمارے نیورل میٹرکس کو اپنی شخصیت، تعلقات اور کیریئر وائب کے مختلف پہلو ظاہر کرنے دیں۔',
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
    en: 'Face Reader needs your camera to capture your photos for your reading. Photos are processed in memory and never stored.',
    zh: 'Face Reader 需要使用你的相机来拍摄解读所需的照片。照片仅在内存中处理，绝不会被存储。',
    hi: 'Face Reader को आपकी रीडिंग के लिए आपकी फ़ोटो कैप्चर करने हेतु आपके कैमरे की आवश्यकता है। फ़ोटो केवल मेमोरी में प्रोसेस होती हैं और कभी संग्रहीत नहीं की जातीं।',
    es: 'Face Reader necesita tu cámara para capturar tus fotos para tu lectura. Las fotos se procesan en memoria y nunca se almacenan.',
    fr: 'Face Reader a besoin de votre caméra pour capturer vos photos pour votre lecture. Les photos sont traitées en mémoire et ne sont jamais stockées.',
    ar: 'يحتاج Face Reader إلى كاميرتك لالتقاط صورك لقراءتك. تتم معالجة الصور في الذاكرة فقط ولا يتم تخزينها أبدًا.',
    bn: 'আপনার রিডিংয়ের জন্য আপনার ছবি ক্যাপচার করতে Face Reader-এর আপনার ক্যামেরা প্রয়োজন। ছবিগুলো শুধু মেমোরিতে প্রক্রিয়া করা হয় এবং কখনো সংরক্ষণ করা হয় না।',
    pt: 'O Face Reader precisa da sua câmara para capturar as suas fotos para a sua leitura. As fotos são processadas na memória e nunca armazenadas.',
    ru: 'Face Reader нужен доступ к камере, чтобы сделать фото для вашего анализа. Фото обрабатываются только в памяти и никогда не сохраняются.',
    ur: 'Face Reader کو آپ کی ریڈنگ کے لیے آپ کی تصاویر لینے کے لیے آپ کے کیمرے کی ضرورت ہے۔ تصاویر صرف میموری میں پروسیس ہوتی ہیں اور کبھی محفوظ نہیں کی جاتیں۔',
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
  'capture.cancelButton': {
    en: 'Cancel', zh: '取消', hi: 'रद्द करें', es: 'Cancelar', fr: 'Annuler', ar: 'إلغاء', bn: 'বাতিল করুন',
    pt: 'Cancelar', ru: 'Отмена', ur: 'منسوخ کریں',
  },
  'capture.step.rest.title': {
    en: 'Rest', zh: '休息', hi: 'आराम', es: 'Descanso', fr: 'Repos', ar: 'راحة', bn: 'বিশ্রাম', pt: 'Descanso', ru: 'Покой', ur: 'آرام',
  },
  'capture.step.rest.prompt': {
    en: 'Let your face completely relax 😌', zh: '让你的脸完全放松 😌', hi: 'अपने चेहरे को पूरी तरह से आराम दें 😌',
    es: 'Deja que tu cara se relaje por completo 😌', fr: 'Laissez votre visage se détendre complètement 😌',
    ar: 'دع وجهك يسترخي تمامًا 😌', bn: 'আপনার মুখ সম্পূর্ণ শিথিল হতে দিন 😌', pt: 'Deixe o seu rosto relaxar completamente 😌',
    ru: 'Позвольте своему лицу полностью расслабиться 😌', ur: 'اپنے چہرے کو مکمل طور پر پرسکون ہونے دیں 😌',
  },
  'capture.step.grin.title': {
    en: 'Grin', zh: '笑容', hi: 'मुस्कान', es: 'Sonrisa', fr: 'Sourire', ar: 'ابتسامة', bn: 'হাসি', pt: 'Sorriso', ru: 'Улыбка', ur: 'مسکراہٹ',
  },
  'capture.step.grin.prompt': {
    en: 'Now flash us your biggest grin 😄', zh: '现在给我们露出你最灿烂的笑容 😄', hi: 'अब हमें अपनी सबसे बड़ी मुस्कान दिखाएं 😄',
    es: 'Ahora muéstranos tu sonrisa más grande 😄', fr: 'Montrez-nous maintenant votre plus grand sourire 😄',
    ar: 'الآن أرِنا أوسع ابتسامة لديك 😄', bn: 'এবার আমাদের আপনার সবচেয়ে বড় হাসি দেখান 😄', pt: 'Agora mostre-nos o seu maior sorriso 😄',
    ru: 'Теперь покажите нам свою самую широкую улыбку 😄', ur: 'اب ہمیں اپنی سب سے بڑی مسکراہٹ دکھائیں 😄',
  },
  'capture.step.stern.title': {
    en: 'Stern', zh: '严肃', hi: 'सख्त', es: 'Seria', fr: 'Sévère', ar: 'جاد', bn: 'কঠোর', pt: 'Séria', ru: 'Строгость', ur: 'سخت',
  },
  'capture.step.stern.prompt': {
    en: 'Now give us your best frown 😤', zh: '现在皱起眉头，给我们看看你严肃的一面 😤', hi: 'अब हमें अपनी सबसे तीखी भौंहें दिखाएं 😤',
    es: 'Ahora muéstranos tu mejor ceño fruncido 😤', fr: 'Montrez-nous maintenant votre plus beau froncement de sourcils 😤',
    ar: 'الآن أرِنا أفضل تكشيرة عابسة لديك 😤', bn: 'এবার আমাদের আপনার সেরা কুঁচকানো ভ্রু দেখান 😤', pt: 'Agora mostre-nos a sua melhor cara de bravo 😤',
    ru: 'Теперь покажите нам свой лучший хмурый взгляд 😤', ur: 'اب ہمیں اپنی سب سے سخت تیوری دکھائیں 😤',
  },
  'capture.step.person1.title': {
    en: 'Person One', zh: '第一位', hi: 'पहला व्यक्ति', es: 'Persona Uno', fr: 'Personne Un', ar: 'الشخص الأول',
    bn: 'প্রথম ব্যক্তি', pt: 'Pessoa Um', ru: 'Первый человек', ur: 'پہلا شخص',
  },
  'capture.step.person1.prompt': {
    en: "Capture the first person's photo.", zh: '拍摄第一位的照片。', hi: 'पहले व्यक्ति की फ़ोटो कैप्चर करें।',
    es: 'Captura la foto de la primera persona.', fr: 'Capturez la photo de la première personne.',
    ar: 'التقط صورة الشخص الأول.', bn: 'প্রথম ব্যক্তির ছবি তুলুন।', pt: 'Capture a foto da primeira pessoa.',
    ru: 'Сделайте фото первого человека.', ur: 'پہلے شخص کی تصویر لیں۔',
  },
  'capture.step.person2.title': {
    en: 'Person Two', zh: '第二位', hi: 'दूसरा व्यक्ति', es: 'Persona Dos', fr: 'Personne Deux', ar: 'الشخص الثاني',
    bn: 'দ্বিতীয় ব্যক্তি', pt: 'Pessoa Dois', ru: 'Второй человек', ur: 'دوسرا شخص',
  },
  'capture.step.person2.prompt': {
    en: "Now capture the second person's photo.", zh: '现在拍摄第二位的照片。', hi: 'अब दूसरे व्यक्ति की फ़ोटो कैप्चर करें।',
    es: 'Ahora captura la foto de la segunda persona.', fr: 'Capturez maintenant la photo de la deuxième personne.',
    ar: 'الآن التقط صورة الشخص الثاني.', bn: 'এখন দ্বিতীয় ব্যক্তির ছবি তুলুন।', pt: 'Agora capture a foto da segunda pessoa.',
    ru: 'Теперь сделайте фото второго человека.', ur: 'اب دوسرے شخص کی تصویر لیں۔',
  },
  'capture.step.solo.title': {
    en: 'Your Photo', zh: '你的照片', hi: 'आपकी फ़ोटो', es: 'Tu Foto', fr: 'Votre Photo', ar: 'صورتك',
    bn: 'আপনার ছবি', pt: 'A Sua Foto', ru: 'Ваше фото', ur: 'آپ کی تصویر',
  },
  'capture.step.solo.prompt': {
    en: 'Capture a clear photo of yourself.', zh: '拍摄一张清晰的自拍照。', hi: 'अपनी एक स्पष्ट फ़ोटो कैप्चर करें।',
    es: 'Captura una foto clara de ti mismo.', fr: 'Capturez une photo claire de vous-même.',
    ar: 'التقط صورة واضحة لنفسك.', bn: 'নিজের একটি স্পষ্ট ছবি তুলুন।', pt: 'Capture uma foto nítida de si mesmo.',
    ru: 'Сделайте чёткое фото себя.', ur: 'اپنی ایک واضح تصویر لیں۔',
  },
  'analyze.title': {
    en: 'Analyze', zh: '分析', hi: 'विश्लेषण', es: 'Analizar', fr: 'Analyser', ar: 'تحليل', bn: 'বিশ্লেষণ', pt: 'Analisar', ru: 'Анализ', ur: 'تجزیہ',
  },
  'analyze.subtitle': {
    en: 'Choose a reading to run.', zh: '选择要运行的解读。', hi: 'चलाने के लिए एक रीडिंग चुनें।', es: 'Elige una lectura para ejecutar.',
    fr: 'Choisissez une lecture à lancer.', ar: 'اختر قراءة لتشغيلها.', bn: 'চালানোর জন্য একটি রিডিং বেছে নিন।', pt: 'Escolha uma leitura para executar.',
    ru: 'Выберите анализ для запуска.', ur: 'چلانے کے لیے ایک ریڈنگ منتخب کریں۔',
  },
  'analyze.module.threeExpression.title': {
    en: 'Character Analysis', zh: '性格分析', hi: 'कैरेक्टर एनालिसिस', es: 'Análisis de Carácter',
    fr: 'Analyse de Caractère', ar: 'تحليل الشخصية', bn: 'ক্যারেক্টার অ্যানালাইসিস', pt: 'Análise de Caráter',
    ru: 'Анализ характера', ur: 'کریکٹر تجزیہ',
  },
  'analyze.module.relationshipHarmony.title': {
    en: 'Relationship Harmony Analyzer', zh: '关系和谐度分析', hi: 'रिलेशनशिप हार्मनी एनालाइज़र',
    es: 'Analizador de armonía en pareja', fr: 'Analyseur d’harmonie relationnelle',
    ar: 'محلل انسجام العلاقة', bn: 'রিলেশনশিপ হারমনি অ্যানালাইজার', pt: 'Analisador de harmonia no relacionamento',
    ru: 'Анализатор гармонии в отношениях', ur: 'ریلیشن شپ ہارمنی تجزیہ کار',
  },
  'analyze.module.careerMatch.title': {
    en: 'What Job Suits You', zh: '最适合你的职业', hi: 'आपके लिए कौन सी नौकरी उपयुक्त है',
    es: 'Qué trabajo te conviene', fr: 'Quel métier vous convient',
    ar: 'ما الوظيفة التي تناسبك', bn: 'আপনার জন্য কোন চাকরি উপযুক্ত', pt: 'Que trabalho combina consigo',
    ru: 'Какая работа вам подходит', ur: 'آپ کے لیے کون سی نوکری موزوں ہے',
  },
  'analyze.comingSoonBadge': {
    en: 'COMING SOON', zh: '即将推出', hi: 'जल्द आ रहा है', es: 'PRÓXIMAMENTE', fr: 'BIENTÔT DISPONIBLE',
    ar: 'قريبًا', bn: 'শীঘ্রই আসছে', pt: 'EM BREVE', ru: 'СКОРО', ur: 'جلد آ رہا ہے',
  },
  'analyze.comingSoon': {
    en: 'More reading modules are on the way ✦', zh: '更多解读模块即将上线 ✦', hi: 'और भी रीडिंग मॉड्यूल जल्द आ रहे हैं ✦',
    es: 'Más módulos de lectura están en camino ✦', fr: "D'autres modules de lecture arrivent ✦",
    ar: 'المزيد من وحدات القراءة قادمة قريبًا ✦', bn: 'আরও রিডিং মডিউল শীঘ্রই আসছে ✦', pt: 'Mais módulos de leitura estão a caminho ✦',
    ru: 'Скоро появятся новые модули анализа ✦', ur: 'مزید ریڈنگ ماڈیولز جلد آ رہے ہیں ✦',
  },
  'results.title': {
    en: 'Results', zh: '结果', hi: 'परिणाम', es: 'Resultados', fr: 'Résultats', ar: 'النتائج', bn: 'ফলাফল', pt: 'Resultados', ru: 'Результаты', ur: 'نتائج',
  },
  'results.emptyTitle': {
    en: 'No Readings Yet', zh: '暂无解读记录', hi: 'अभी तक कोई रीडिंग नहीं', es: 'Aún no hay lecturas', fr: "Aucune lecture pour l'instant",
    ar: 'لا توجد قراءات بعد', bn: 'এখনো কোনো রিডিং নেই', pt: 'Ainda sem leituras', ru: 'Пока нет анализов', ur: 'ابھی تک کوئی ریڈنگ نہیں',
  },
  'results.emptyBody': {
    en: 'Your past readings will show up here once you complete your first analysis.',
    zh: '完成首次分析后，你的历史解读记录将会显示在这里。',
    hi: 'आपकी पहली विश्लेषण पूरी होने के बाद पिछली रीडिंग यहां दिखाई देंगी।',
    es: 'Tus lecturas anteriores aparecerán aquí una vez que completes tu primer análisis.',
    fr: 'Vos lectures précédentes apparaîtront ici une fois votre première analyse terminée.',
    ar: 'ستظهر قراءاتك السابقة هنا بمجرد إكمال أول تحليل لك.',
    bn: 'আপনার প্রথম বিশ্লেষণ সম্পন্ন হলে অতীতের রিডিংগুলো এখানে দেখা যাবে।',
    pt: 'As suas leituras anteriores aparecerão aqui assim que concluir a sua primeira análise.',
    ru: 'Здесь появятся ваши прошлые анализы после завершения первого.',
    ur: 'آپ کی پہلی تجزیہ مکمل ہونے کے بعد پچھلی ریڈنگز یہاں دکھائی دیں گی۔',
  },
  'common.startAnalysis': {
    en: 'Start Analysis', zh: '开始分析', hi: 'विश्लेषण शुरू करें', es: 'Iniciar análisis', fr: "Démarrer l'analyse",
    ar: 'بدء التحليل', bn: 'বিশ্লেষণ শুরু করুন', pt: 'Iniciar análise', ru: 'Начать анализ', ur: 'تجزیہ شروع کریں',
  },
  'review.headerTitle': {
    en: 'Rate Experience', zh: '评价体验', hi: 'अनुभव को रेट करें', es: 'Calificar experiencia', fr: "Évaluer l'expérience",
    ar: 'تقييم التجربة', bn: 'অভিজ্ঞতা রেট করুন', pt: 'Avaliar experiência', ru: 'Оценить опыт', ur: 'تجربے کی درجہ بندی کریں',
  },
  'review.headline': {
    en: 'Enjoying your insights with Face Reader?', zh: '喜欢 Face Reader 给你的洞察吗？', hi: 'Face Reader के साथ अपने इनसाइट्स का आनंद ले रहे हैं?',
    es: '¿Disfrutando tus análisis con Face Reader?', fr: 'Vous appréciez vos analyses avec Face Reader ?',
    ar: 'هل تستمتع برؤاك مع Face Reader؟', bn: 'Face Reader-এর সাথে আপনার ইনসাইট উপভোগ করছেন?', pt: 'A gostar das suas análises com o Face Reader?',
    ru: 'Нравятся ваши результаты в Face Reader?', ur: 'کیا آپ Face Reader کے ساتھ اپنی بصیرت سے لطف اندوز ہو رہے ہیں؟',
  },
  'review.body': {
    en: 'Your feedback helps us train our AI models and improve your experience.',
    zh: '你的反馈将帮助我们训练 AI 模型并改善你的体验。',
    hi: 'आपकी प्रतिक्रिया हमें हमारे AI मॉडल को प्रशिक्षित करने और आपके अनुभव को बेहतर बनाने में मदद करती है।',
    es: 'Tu opinión nos ayuda a entrenar nuestros modelos de IA y mejorar tu experiencia.',
    fr: "Vos commentaires nous aident à entraîner nos modèles d'IA et à améliorer votre expérience.",
    ar: 'ملاحظاتك تساعدنا على تدريب نماذج الذكاء الاصطناعي وتحسين تجربتك.',
    bn: 'আপনার মতামত আমাদের AI মডেল প্রশিক্ষণে ও অভিজ্ঞতা উন্নত করতে সাহায্য করে।',
    pt: 'O seu feedback ajuda-nos a treinar os nossos modelos de IA e a melhorar a sua experiência.',
    ru: 'Ваш отзыв помогает нам обучать модели ИИ и улучшать ваш опыт.',
    ur: 'آپ کی رائے ہمیں AI ماڈلز کو تربیت دینے اور آپ کے تجربے کو بہتر بنانے میں مدد دیتی ہے۔',
  },
  'review.rateButton': {
    en: 'Rate on App Store', zh: '前往 App Store 评分', hi: 'ऐप स्टोर पर रेट करें', es: 'Calificar en App Store',
    fr: "Évaluer sur l'App Store", ar: 'قيّمنا على متجر التطبيقات', bn: 'অ্যাপ স্টোরে রেট করুন', pt: 'Avaliar na App Store',
    ru: 'Оценить в App Store', ur: 'ایپ اسٹور پر ریٹ کریں',
  },
  'review.maybeLater': {
    en: 'Maybe Later', zh: '以后再说', hi: 'शायद बाद में', es: 'Quizás más tarde', fr: 'Plus tard peut-être',
    ar: 'ربما لاحقًا', bn: 'হয়তো পরে', pt: 'Talvez mais tarde', ru: 'Может быть позже', ur: 'شاید بعد میں',
  },
  'review.starLabel': {
    en: 'Rate {n} stars', zh: '评{n}星', hi: '{n} स्टार रेट करें', es: 'Calificar con {n} estrellas', fr: 'Noter {n} étoiles',
    ar: 'قيّم بـ {n} نجوم', bn: '{n} তারকা রেট করুন', pt: 'Avaliar com {n} estrelas', ru: 'Оценить на {n} звёзд', ur: '{n} ستارے دیں',
  },
  'paywall.headline': {
    en: 'Unlock Full AI Face Insights', zh: '解锁完整 AI 面部洞察', hi: 'पूर्ण AI फेस इनसाइट्स अनलॉक करें',
    es: 'Desbloquea todos los análisis faciales con IA', fr: 'Débloquez toutes les analyses faciales par IA',
    ar: 'افتح رؤى الوجه الكاملة بالذكاء الاصطناعي', bn: 'সম্পূর্ণ AI ফেস ইনসাইট আনলক করুন', pt: 'Desbloqueie todas as análises faciais com IA',
    ru: 'Откройте полный ИИ-анализ лица', ur: 'مکمل AI فیس بصیرت اَن لاک کریں',
  },
  'paywall.subtitle': {
    en: 'Experience unlimited AI face readings and deep personality reports, unlocked instantly.',
    zh: '体验无限次 AI 面部解读与深度性格报告，即刻解锁。',
    hi: 'असीमित AI फेस रीडिंग और गहन व्यक्तित्व रिपोर्ट का अनुभव करें, तुरंत अनलॉक।',
    es: 'Disfruta de lecturas faciales con IA ilimitadas e informes de personalidad profundos, desbloqueados al instante.',
    fr: "Profitez de lectures faciales par IA illimitées et de rapports de personnalité approfondis, débloqués instantanément.",
    ar: 'استمتع بقراءات وجه غير محدودة بالذكاء الاصطناعي وتقارير شخصية عميقة، تُفتح فورًا.',
    bn: 'সীমাহীন AI ফেস রিডিং ও গভীর ব্যক্তিত্ব রিপোর্ট উপভোগ করুন, তাৎক্ষণিকভাবে আনলক।',
    pt: 'Desfrute de leituras faciais com IA ilimitadas e relatórios de personalidade profundos, desbloqueados instantaneamente.',
    ru: 'Получите неограниченные ИИ-анализы лица и глубокие отчёты о личности — разблокировано мгновенно.',
    ur: 'لامحدود AI فیس ریڈنگز اور گہری شخصیت رپورٹس سے لطف اندوز ہوں، فوری اَن لاک۔',
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
  'analyzing.headline': {
    en: 'Reading Your Expressions', zh: '正在解读你的表情', hi: 'आपके एक्सप्रेशन पढ़े जा रहे हैं',
    es: 'Leyendo tus expresiones', fr: 'Lecture de vos expressions', ar: 'جارٍ قراءة تعابيرك',
    bn: 'আপনার এক্সপ্রেশন পড়া হচ্ছে', pt: 'A ler as suas expressões', ru: 'Анализ ваших выражений', ur: 'آپ کے تاثرات پڑھے جا رہے ہیں',
  },
  'analyzing.subtitle': {
    en: 'Our AI is generating your reading...', zh: '我们的 AI 正在生成你的解读……',
    hi: 'हमारा AI आपकी रीडिंग तैयार कर रहा है...', es: 'Nuestra IA está generando tu lectura...',
    fr: 'Notre IA génère votre lecture...', ar: 'يقوم الذكاء الاصطناعي بإنشاء قراءتك...',
    bn: 'আমাদের AI আপনার রিডিং তৈরি করছে...', pt: 'A nossa IA está a gerar a sua leitura...',
    ru: 'Наш ИИ создаёт ваш анализ...', ur: 'ہمارا AI آپ کی ریڈنگ تیار کر رہا ہے...',
  },
  'analyzing.error.title': {
    en: 'Something Went Wrong', zh: '出错了', hi: 'कुछ गलत हो गया', es: 'Algo salió mal', fr: "Une erreur s'est produite",
    ar: 'حدث خطأ ما', bn: 'কিছু ভুল হয়েছে', pt: 'Algo correu mal', ru: 'Что-то пошло не так', ur: 'کچھ غلط ہو گیا',
  },
  'analyzing.error.body': {
    en: "We couldn't generate your reading. Please check your connection and try again.",
    zh: '我们无法生成你的解读。请检查网络连接后重试。',
    hi: 'हम आपकी रीडिंग तैयार नहीं कर सके। कृपया अपना कनेक्शन जांचें और फिर से कोशिश करें।',
    es: 'No pudimos generar tu lectura. Comprueba tu conexión e inténtalo de nuevo.',
    fr: "Nous n'avons pas pu générer votre lecture. Vérifiez votre connexion et réessayez.",
    ar: 'تعذر إنشاء قراءتك. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
    bn: 'আমরা আপনার রিডিং তৈরি করতে পারিনি। আপনার সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
    pt: 'Não foi possível gerar a sua leitura. Verifique a sua ligação e tente novamente.',
    ru: 'Не удалось создать ваш анализ. Проверьте соединение и попробуйте снова.',
    ur: 'ہم آپ کی ریڈنگ تیار نہیں کر سکے۔ براہ کرم اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔',
  },
  'analyzing.error.retry': {
    en: 'Try Again', zh: '重试', hi: 'फिर से कोशिश करें', es: 'Intentar de nuevo', fr: 'Réessayer', ar: 'إعادة المحاولة',
    bn: 'আবার চেষ্টা করুন', pt: 'Tentar novamente', ru: 'Повторить', ur: 'دوبارہ کوشش کریں',
  },
  'analyzing.error.backHome': {
    en: 'Back to Analyze', zh: '返回分析', hi: 'विश्लेषण पर वापस जाएं', es: 'Volver a Analizar',
    fr: "Retour à Analyser", ar: 'العودة إلى التحليل', bn: 'বিশ্লেষণে ফিরে যান', pt: 'Voltar a Analisar',
    ru: 'Назад к анализу', ur: 'تجزیہ پر واپس جائیں',
  },
  'noFaceDetected.headline': {
    en: "We Couldn't Find a Face", zh: '未检测到人脸', hi: 'चेहरा नहीं मिला', es: 'No pudimos encontrar un rostro',
    fr: "Nous n'avons pas trouvé de visage", ar: 'لم نتمكن من العثور على وجه', bn: 'কোনো মুখ খুঁজে পাওয়া যায়নি',
    pt: 'Não encontrámos um rosto', ru: 'Лицо не найдено', ur: 'کوئی چہرہ نہیں ملا',
  },
  'noFaceDetected.body': {
    en: 'Make sure your face is clearly framed in good lighting, then give it another shot.',
    zh: '请确保脸部在光线充足的情况下清晰入镜，然后再试一次。',
    hi: 'सुनिश्चित करें कि आपका चेहरा अच्छी रोशनी में स्पष्ट रूप से फ्रेम में हो, फिर दोबारा कोशिश करें।',
    es: 'Asegúrate de que tu rostro esté bien encuadrado y con buena luz, luego inténtalo de nuevo.',
    fr: 'Assurez-vous que votre visage est bien cadré avec un bon éclairage, puis réessayez.',
    ar: 'تأكد من أن وجهك ظاهر بوضوح وفي إضاءة جيدة، ثم حاول مرة أخرى.',
    bn: 'ভালো আলোতে আপনার মুখ স্পষ্টভাবে ফ্রেমে আছে কিনা নিশ্চিত করুন, তারপর আবার চেষ্টা করুন।',
    pt: 'Certifique-se de que o seu rosto está bem enquadrado com boa iluminação e tente novamente.',
    ru: 'Убедитесь, что ваше лицо чётко видно при хорошем освещении, и попробуйте снова.',
    ur: 'یقینی بنائیں کہ آپ کا چہرہ اچھی روشنی میں واضح طور پر فریم میں ہے، پھر دوبارہ کوشش کریں۔',
  },
  'noFaceDetected.retry': {
    en: 'Retake Photos', zh: '重新拍照', hi: 'फिर से फ़ोटो लें', es: 'Repetir fotos', fr: 'Reprendre les photos',
    ar: 'إعادة التقاط الصور', bn: 'আবার ছবি তুলুন', pt: 'Tirar fotos novamente', ru: 'Переснять фото', ur: 'دوبارہ تصاویر لیں',
  },
  'noFaceDetected.backHome': {
    en: 'Back to Analyze', zh: '返回分析', hi: 'विश्लेषण पर वापस जाएं', es: 'Volver a Analizar',
    fr: "Retour à Analyser", ar: 'العودة إلى التحليل', bn: 'বিশ্লেষণে ফিরে যান', pt: 'Voltar a Analisar',
    ru: 'Назад к анализу', ur: 'تجزیہ پر واپس جائیں',
  },
  'reveal.title': {
    en: 'Your Reading', zh: '你的解读', hi: 'आपकी रीडिंग', es: 'Tu lectura', fr: 'Votre lecture', ar: 'قراءتك',
    bn: 'আপনার রিডিং', pt: 'A sua leitura', ru: 'Ваш анализ', ur: 'آپ کی ریڈنگ',
  },
  'reveal.doneButton': {
    en: 'Done', zh: '完成', hi: 'पूर्ण', es: 'Listo', fr: 'Terminé', ar: 'تم', bn: 'সম্পন্ন', pt: 'Concluído', ru: 'Готово', ur: 'مکمل',
  },
  'reveal.shareButton': {
    en: 'Share Reading', zh: '分享解读', hi: 'रीडिंग शेयर करें', es: 'Compartir lectura', fr: 'Partager la lecture',
    ar: 'مشاركة القراءة', bn: 'রিডিং শেয়ার করুন', pt: 'Partilhar leitura', ru: 'Поделиться анализом', ur: 'ریڈنگ شیئر کریں',
  },
  'share.modalTitle': {
    en: 'Share Your Reading', zh: '分享你的解读', hi: 'अपनी रीडिंग शेयर करें', es: 'Comparte tu lectura',
    fr: 'Partagez votre lecture', ar: 'شارك قراءتك', bn: 'আপনার রিডিং শেয়ার করুন', pt: 'Partilhe a sua leitura',
    ru: 'Поделитесь своим анализом', ur: 'اپنی ریڈنگ شیئر کریں',
  },
  'share.includePhoto': {
    en: 'Include my photo', zh: '包含我的照片', hi: 'मेरी फ़ोटो शामिल करें', es: 'Incluir mi foto',
    fr: 'Inclure ma photo', ar: 'تضمين صورتي', bn: 'আমার ছবি অন্তর্ভুক্ত করুন', pt: 'Incluir a minha foto',
    ru: 'Добавить моё фото', ur: 'میری تصویر شامل کریں',
  },
  'share.optionImage.title': {
    en: 'Story Card', zh: '故事卡片', hi: 'स्टोरी कार्ड', es: 'Tarjeta para historias', fr: 'Carte pour story',
    ar: 'بطاقة القصة', bn: 'স্টোরি কার্ড', pt: 'Cartão para stories', ru: 'Карточка для сторис', ur: 'اسٹوری کارڈ',
  },
  'share.optionImage.subtitle': {
    en: 'A ready-to-post image card', zh: '一张可直接发布的图片卡片', hi: 'पोस्ट करने के लिए तैयार इमेज कार्ड',
    es: 'Una tarjeta lista para publicar', fr: 'Une carte prête à publier', ar: 'بطاقة جاهزة للنشر',
    bn: 'পোস্ট করার জন্য প্রস্তুত ইমেজ কার্ড', pt: 'Um cartão pronto a publicar', ru: 'Готовая к публикации карточка',
    ur: 'پوسٹ کرنے کے لیے تیار امیج کارڈ',
  },
  'share.optionText.title': {
    en: 'Quick Message', zh: '快速消息', hi: 'क्विक मैसेज', es: 'Mensaje rápido', fr: 'Message rapide',
    ar: 'رسالة سريعة', bn: 'দ্রুত বার্তা', pt: 'Mensagem rápida', ru: 'Короткое сообщение', ur: 'فوری پیغام',
  },
  'share.optionText.subtitle': {
    en: 'Send the highlights as text', zh: '以文字形式发送要点', hi: 'मुख्य बातें टेक्स्ट के रूप में भेजें',
    es: 'Envía lo más destacado como texto', fr: "Envoyez l'essentiel en texte", ar: 'أرسل الأبرز كنص',
    bn: 'মূল বিষয়গুলো টেক্সট আকারে পাঠান', pt: 'Envie os destaques como texto', ru: 'Отправьте главное текстом',
    ur: 'اہم باتیں متن کے طور پر بھیجیں',
  },
  'share.optionCopy.title': {
    en: 'Copy Text', zh: '复制文字', hi: 'टेक्स्ट कॉपी करें', es: 'Copiar texto', fr: 'Copier le texte',
    ar: 'نسخ النص', bn: 'টেক্সট কপি করুন', pt: 'Copiar texto', ru: 'Копировать текст', ur: 'متن کاپی کریں',
  },
  'share.optionCopy.subtitle': {
    en: 'Paste it in anywhere yourself', zh: '自行粘贴到任何地方', hi: 'इसे कहीं भी स्वयं पेस्ट करें',
    es: 'Pégalo tú mismo donde quieras', fr: "Collez-le où vous voulez", ar: 'الصقه في أي مكان بنفسك',
    bn: 'নিজে যেকোনো জায়গায় পেস্ট করুন', pt: 'Cole onde quiser', ru: 'Вставьте куда угодно сами',
    ur: 'اسے کہیں بھی خود پیسٹ کریں',
  },
  'share.copiedTitle': {
    en: 'Copied!', zh: '已复制！', hi: 'कॉपी हो गया!', es: '¡Copiado!', fr: 'Copié !', ar: 'تم النسخ!',
    bn: 'কপি হয়েছে!', pt: 'Copiado!', ru: 'Скопировано!', ur: 'کاپی ہوگیا!',
  },
  'share.copiedBody': {
    en: 'Your reading is ready to paste anywhere.', zh: '你的解读已可粘贴到任何地方。',
    hi: 'आपकी रीडिंग कहीं भी पेस्ट करने के लिए तैयार है।', es: 'Tu lectura está lista para pegar donde quieras.',
    fr: 'Votre lecture est prête à être collée où vous voulez.', ar: 'قراءتك جاهزة للصقها في أي مكان.',
    bn: 'আপনার রিডিং যেকোনো জায়গায় পেস্ট করার জন্য প্রস্তুত।', pt: 'A sua leitura está pronta para colar em qualquer lugar.',
    ru: 'Ваш анализ готов для вставки куда угодно.', ur: 'آپ کی ریڈنگ کہیں بھی پیسٹ کرنے کے لیے تیار ہے۔',
  },
  'share.builder.title': {
    en: 'Build Your Card', zh: '制作你的卡片', hi: 'अपना कार्ड बनाएं', es: 'Crea tu tarjeta', fr: 'Créez votre carte',
    ar: 'أنشئ بطاقتك', bn: 'আপনার কার্ড তৈরি করুন', pt: 'Crie o seu cartão', ru: 'Создайте свою карточку',
    ur: 'اپنا کارڈ بنائیں',
  },
  'share.builder.subtitle': {
    en: 'Pick what shows up on your card', zh: '选择卡片上显示的内容', hi: 'अपने कार्ड पर क्या दिखे, चुनें',
    es: 'Elige qué aparece en tu tarjeta', fr: 'Choisissez ce qui apparaît sur votre carte',
    ar: 'اختر ما يظهر على بطاقتك', bn: 'আপনার কার্ডে কী দেখাবে তা বেছে নিন', pt: 'Escolha o que aparece no seu cartão',
    ru: 'Выберите, что показать на карточке', ur: 'منتخب کریں کہ آپ کے کارڈ پر کیا دکھایا جائے',
  },
  'share.builder.createButton': {
    en: 'Create & Share', zh: '创建并分享', hi: 'बनाएं और शेयर करें', es: 'Crear y compartir', fr: 'Créer et partager',
    ar: 'إنشاء ومشاركة', bn: 'তৈরি করুন ও শেয়ার করুন', pt: 'Criar e partilhar', ru: 'Создать и поделиться',
    ur: 'بنائیں اور شیئر کریں',
  },
  'share.builder.back': {
    en: 'Back', zh: '返回', hi: 'वापस', es: 'Atrás', fr: 'Retour', ar: 'رجوع', bn: 'পিছনে', pt: 'Voltar',
    ru: 'Назад', ur: 'واپس',
  },
  'share.shareTextTemplate': {
    en: 'I just got "{badge}" on Face Reader ✨\n\n{summary}\n\nGet your own AI face reading!',
    zh: '我在 Face Reader 上获得了"{badge}" ✨\n\n{summary}\n\n快来获取你自己的 AI 面部解读吧！',
    hi: 'मुझे Face Reader पर "{badge}" मिला ✨\n\n{summary}\n\nअपनी खुद की AI फेस रीडिंग पाएं!',
    es: 'Acabo de obtener "{badge}" en Face Reader ✨\n\n{summary}\n\n¡Consigue tu propia lectura facial con IA!',
    fr: 'Je viens de recevoir "{badge}" sur Face Reader ✨\n\n{summary}\n\nObtenez votre propre lecture faciale par IA !',
    ar: 'حصلت للتو على "{badge}" في Face Reader ✨\n\n{summary}\n\nاحصل على قراءة وجهك بالذكاء الاصطناعي!',
    bn: 'আমি Face Reader-এ "{badge}" পেয়েছি ✨\n\n{summary}\n\nআপনার নিজের AI ফেস রিডিং নিন!',
    pt: 'Acabei de receber "{badge}" no Face Reader ✨\n\n{summary}\n\nObtenha a sua própria leitura facial com IA!',
    ru: 'Я только что получил(а) "{badge}" в Face Reader ✨\n\n{summary}\n\nПолучите свой собственный ИИ-анализ лица!',
    ur: 'مجھے Face Reader پر "{badge}" ملا ✨\n\n{summary}\n\nاپنی AI فیس ریڈنگ حاصل کریں!',
  },
  'welcome.headline': {
    en: "You're All Set", zh: '一切准备就绪', hi: 'आप तैयार हैं', es: 'Todo listo', fr: 'Vous êtes prêt',
    ar: 'أنت جاهز الآن', bn: 'আপনি প্রস্তুত', pt: 'Está tudo pronto', ru: 'Всё готово', ur: 'آپ تیار ہیں',
  },
  'welcome.subtitle': {
    en: "Your AI character reading journey starts now. Capture your first photos whenever you're ready.",
    zh: '你的 AI 性格解读之旅现在开始。准备好后即可拍摄你的照片。',
    hi: 'आपकी AI कैरेक्टर रीडिंग यात्रा अभी शुरू होती है। जब भी तैयार हों, अपनी फ़ोटो कैप्चर करें।',
    es: 'Tu viaje de lectura de carácter con IA comienza ahora. Captura tus fotos cuando quieras.',
    fr: 'Votre parcours de lecture de caractère par IA commence maintenant. Capturez vos photos quand vous serez prêt.',
    ar: 'تبدأ رحلتك في قراءة الشخصية بالذكاء الاصطناعي الآن. التقط صورك عندما تكون مستعدًا.',
    bn: 'আপনার AI ক্যারেক্টার রিডিং যাত্রা এখনই শুরু হচ্ছে। প্রস্তুত হলে আপনার ছবি ধারণ করুন।',
    pt: 'A sua jornada de leitura de caráter com IA começa agora. Capture as suas fotos quando estiver pronto.',
    ru: 'Ваше путешествие с ИИ-анализом характера начинается прямо сейчас. Сделайте фото, когда будете готовы.',
    ur: 'آپ کا AI کریکٹر ریڈنگ سفر ابھی شروع ہوتا ہے۔ جب تیار ہوں اپنی تصاویر کیپچر کریں۔',
  },
  'welcome.cta': {
    en: "Let's Go", zh: '开始吧', hi: 'चलिए शुरू करें', es: 'Vamos', fr: 'Allons-y', ar: 'هيا بنا',
    bn: 'চলুন শুরু করি', pt: 'Vamos lá', ru: 'Поехали', ur: 'چلیں شروع کریں',
  },
  'common.close': {
    en: 'Close', zh: '关闭', hi: 'बंद करें', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق', bn: 'বন্ধ করুন', pt: 'Fechar', ru: 'Закрыть', ur: 'بند کریں',
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
  'reveal.overallLabel': {
    en: 'Overall', zh: '综合', hi: 'कुल', es: 'General', fr: 'Global',
    ar: 'الإجمالي', bn: 'সামগ্রিক', pt: 'Geral', ru: 'Общий', ur: 'مجموعی',
  },
  'reveal.strengths': {
    en: 'Strengths', zh: '优势', hi: 'ताकत', es: 'Fortalezas', fr: 'Forces',
    ar: 'نقاط القوة', bn: 'শক্তি', pt: 'Pontos fortes', ru: 'Сильные стороны', ur: 'خوبیاں',
  },
  'reveal.growthEdges': {
    en: 'Growth Edges', zh: '成长空间', hi: 'विकास के क्षेत्र', es: 'Áreas de crecimiento', fr: 'Axes de progression',
    ar: 'مجالات النمو', bn: 'বৃদ্ধির ক্ষেত্র', pt: 'Áreas de crescimento', ru: 'Зоны роста', ur: 'ترقی کے پہلو',
  },
  'reveal.bestChemistry': {
    en: 'Best Chemistry', zh: '最佳默契', hi: 'बेहतरीन तालमेल', es: 'Mejor química', fr: 'Meilleure alchimie',
    ar: 'أفضل انسجام', bn: 'সেরা রসায়ন', pt: 'Melhor química', ru: 'Лучшая химия', ur: 'بہترین ہم آہنگی',
  },
  'reveal.vibesToAvoid': {
    en: 'Vibes to Avoid', zh: '需要避开的氛围', hi: 'बचने योग्य बातें', es: 'Dinámicas a evitar', fr: 'Dynamiques à éviter',
    ar: 'أنماط يُفضّل تجنّبها', bn: 'এড়িয়ে চলার বিষয়', pt: 'Dinâmicas a evitar', ru: 'Чего избегать', ur: 'جن سے بچنا ہے',
  },
} satisfies Record<string, Record<LanguageCode, string>>;

export function translate(key: TranslationKey, languageCode: string, vars?: Record<string, string | number>): string {
  const entry = translations[key];
  const raw = entry[languageCode as LanguageCode] ?? entry.en;
  if (!vars) return raw;
  return Object.entries(vars).reduce((acc, [name, value]) => acc.replace(`{${name}}`, String(value)), raw);
}

export type { TranslationKey };
