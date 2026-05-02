export type GalleryCategory =
  | "classrooms"
  | "activities"
  | "play"
  | "events"
  | "facilities"
  | "staff"
  | "exterior";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  category: GalleryCategory;
  featured?: boolean;
};

export const galleryCategories = [
  { id: "all", label: "الكل" },
  { id: "classrooms", label: "الصفوف" },
  { id: "activities", label: "الأنشطة" },
  { id: "play", label: "اللعب" },
  { id: "events", label: "الفعاليات" },
  { id: "facilities", label: "المرافق" },
  { id: "staff", label: "الفريق" },
  { id: "exterior", label: "الواجهة" },
] as const;

export const galleryImages: GalleryImage[] = [
  // ═══════════════════════════════════════════
  // العيد الوطني — National Day (events)
  // ═══════════════════════════════════════════
  {
    id: "national-day-performance-01",
    src: "/images/school-gallery/events/national-day-performance-01.jpeg",
    alt: "طفلة تؤدي عرضًا في احتفال العيد الوطني في مدرسة قناديل العلم (مرحلة الروضة)",
    title: "عرض العيد الوطني",
    description:
      "أطفال الروضة يشاركون بعروض جميلة في احتفالات العيد الوطني العُماني.",
    category: "events",
    featured: true,
  },
  {
    id: "national-day-art-01",
    src: "/images/school-gallery/events/national-day-art-01.jpeg",
    alt: "طفلة تقف بجانب لوحة فنية في احتفال العيد الوطني",
    title: "إبداع فني وطني",
    description:
      "رسومات فنية من إبداع أطفال الروضة بمناسبة العيد الوطني.",
    category: "events",
    featured: true,
  },
  {
    id: "national-day-celebration-01",
    src: "/images/school-gallery/events/national-day-celebration-01.jpeg",
    alt: "بنات يحتفلن بالعيد الوطني في مدرسة قناديل العلم (مرحلة الروضة)",
    title: "فرحة العيد الوطني",
    description:
      "أجواء احتفالية مفعمة بالفرح والحب الوطني في رحاب الروضة.",
    category: "events",
    featured: true,
  },
  {
    id: "national-day-celebration-02",
    src: "/images/school-gallery/events/national-day-celebration-02.jpeg",
    alt: "أطفال في احتفال العيد الوطني في مدرسة قناديل العلم (مرحلة الروضة)",
    title: "لحظات وطنية",
    description:
      "أطفال الروضة في أزيائهم الوطنية أثناء الاحتفال بالعيد الوطني.",
    category: "events",
  },
  {
    id: "national-day-boys-01",
    src: "/images/school-gallery/events/national-day-boys-01.jpeg",
    alt: "أطفال بزي رسمي في احتفال العيد الوطني",
    title: "أناقة العيد الوطني",
    description:
      "أطفال الروضة بأزيائهم الرسمية الأنيقة في احتفالات العيد الوطني.",
    category: "events",
    featured: true,
  },
  {
    id: "national-day-family-01",
    src: "/images/school-gallery/events/national-day-family-01.jpeg",
    alt: "عائلة تشارك في احتفال العيد الوطني بمدرسة قناديل العلم (مرحلة الروضة)",
    title: "مشاركة أولياء الأمور",
    description:
      "العائلات تشارك أطفالها فرحة الاحتفال بالعيد الوطني في الروضة.",
    category: "events",
  },
  {
    id: "national-day-art-02",
    src: "/images/school-gallery/events/national-day-art-02.jpeg",
    alt: "طفلة تشير إلى لوحة فنية في معرض العيد الوطني بمدرسة قناديل العلم (مرحلة الروضة)",
    title: "معرض فني وطني",
    description:
      "إبداعات الأطفال الفنية في معرض العيد الوطني العُماني.",
    category: "events",
    featured: true,
  },
  {
    id: "national-day-dance-01",
    src: "/images/school-gallery/events/national-day-dance-01.jpeg",
    alt: "أطفال يؤدون عرضًا راقصًا في العيد الوطني",
    title: "عرض راقص وطني",
    description:
      "أطفال الروضة يقدمون عرضًا راقصًا ممتعًا بمناسبة العيد الوطني.",
    category: "events",
  },

  // ═══════════════════════════════════════════
  // حفل التخرج — Graduation (events)
  // ═══════════════════════════════════════════
  {
    id: "graduation-ceremony-01",
    src: "/images/school-gallery/events/graduation-ceremony-01.jpeg",
    alt: "حفل تخرج أطفال مدرسة قناديل العلم (مرحلة الروضة) 2026",
    title: "حفل التخرج",
    description:
      "لحظات فخر واحتفال بتخرج أطفالنا من مدرسة قناديل العلم (مرحلة الروضة).",
    category: "events",
    featured: true,
  },
  {
    id: "graduation-ceremony-02",
    src: "/images/school-gallery/events/graduation-ceremony-02.jpeg",
    alt: "طفلة متخرجة بقبعة التخرج في مدرسة قناديل العلم (مرحلة الروضة)",
    title: "مبروك التخرج",
    description:
      "طفلة متخرجة ترتدي رداء التخرج الأزرق وتحمل باقة ورد.",
    category: "events",
  },
  {
    id: "graduation-ceremony-03",
    src: "/images/school-gallery/events/graduation-ceremony-03.jpeg",
    alt: "طفلة تحمل شهادة التخرج في حفل تخرج قناديل العلم",
    title: "شهادة التخرج",
    description:
      "لحظة استلام شهادة التخرج مع وشاح ألف مبروك.",
    category: "events",
    featured: true,
  },
  {
    id: "graduation-ceremony-04",
    src: "/images/school-gallery/events/graduation-ceremony-04.jpeg",
    alt: "طفلة بزي التخرج الكستنائي في مدرسة قناديل العلم (مرحلة الروضة)",
    title: "فخر التخرج",
    description:
      "طفلة ترتدي رداء التخرج وتحمل باقة ورد احتفالاً بإنهاء مرحلة الروضة.",
    category: "events",
  },

  // ═══════════════════════════════════════════
  // رمضان وحق الليلة — Ramadan (events)
  // ═══════════════════════════════════════════
  {
    id: "ramadan-haq-allaila-01",
    src: "/images/school-gallery/events/ramadan-haq-allaila-01.jpeg",
    alt: "طفل يحتفل بحق الليلة في رمضان بمدرسة قناديل العلم (مرحلة الروضة)",
    title: "حق الليلة – رمضان",
    description:
      "أجواء رمضانية جميلة واحتفال حق الليلة مع أطفال الروضة.",
    category: "events",
    featured: true,
  },
  {
    id: "ramadan-haq-allaila-02",
    src: "/images/school-gallery/events/ramadan-haq-allaila-02.jpeg",
    alt: "طفلة بزي تقليدي عُماني في احتفال رمضان",
    title: "زي تقليدي رمضاني",
    description:
      "طفلة ترتدي الزي التقليدي العُماني وتحمل سلة حق الليلة.",
    category: "events",
  },
  {
    id: "ramadan-haq-allaila-03",
    src: "/images/school-gallery/events/ramadan-haq-allaila-03.jpeg",
    alt: "طفلة تحمل لافتة حق الليلة في احتفال رمضان",
    title: "حق الليلة – بنات",
    description:
      "طفلة تحمل لافتة حق الليلة المزينة في أجواء رمضانية دافئة.",
    category: "events",
  },
  {
    id: "ramadan-haq-allaila-04",
    src: "/images/school-gallery/events/ramadan-haq-allaila-04.jpeg",
    alt: "طفل بالزي العُماني التقليدي يحمل سلة حق الليلة",
    title: "حق الليلة – أولاد",
    description:
      "طفل يرتدي الدشداشة والكمة ويحمل سلة الخوص في احتفال رمضاني.",
    category: "events",
  },
  {
    id: "ramadan-decoration-01",
    src: "/images/school-gallery/events/ramadan-decoration-01.jpeg",
    alt: "ديكور رمضاني في مدرسة قناديل العلم (مرحلة الروضة)",
    title: "أجواء رمضان",
    description:
      "ديكورات رمضانية تقليدية مع إضاءة نجمية وسلال خوص وحلويات.",
    category: "events",
  },

  // ═══════════════════════════════════════════
  // حفلة عيد ميلاد — Birthday (events)
  // ═══════════════════════════════════════════
  {
    id: "birthday-celebration-01",
    src: "/images/school-gallery/events/birthday-celebration-01.jpeg",
    alt: "حفلة عيد ميلاد في مدرسة قناديل العلم (مرحلة الروضة)",
    title: "احتفال عيد ميلاد",
    description:
      "لحظات سعيدة من احتفالات أعياد ميلاد الأطفال داخل الروضة.",
    category: "events",
  },

  // ═══════════════════════════════════════════
  // الصفوف وبدء العام — Classrooms
  // ═══════════════════════════════════════════
  {
    id: "ramadan-class-group-01",
    src: "/images/school-gallery/classrooms/ramadan-class-group-01.jpeg",
    alt: "صورة جماعية لأطفال الصف في احتفال رمضان",
    title: "صورة جماعية – رمضان",
    description:
      "أطفال الصف بزيهم المدرسي في صورة جماعية أمام ديكور رمضاني.",
    category: "classrooms",
    featured: true,
  },
  {
    id: "ramadan-class-group-02",
    src: "/images/school-gallery/classrooms/ramadan-class-group-02.jpeg",
    alt: "صورة جماعية لأطفال صف آخر في احتفال رمضان",
    title: "صف آخر – رمضان",
    description:
      "مجموعة أخرى من أطفال الروضة في صورة جماعية رمضانية.",
    category: "classrooms",
  },
  {
    id: "first-day-girls-01",
    src: "/images/school-gallery/classrooms/first-day-girls-01.jpeg",
    alt: "بنات في أول يوم دراسي بمدرسة قناديل العلم (مرحلة الروضة)",
    title: "أول يوم – بنات",
    description:
      "ابتسامات البنات في أول يوم دراسي مع ورود وهدايا الترحيب.",
    category: "classrooms",
    featured: true,
  },
  {
    id: "first-day-girls-02",
    src: "/images/school-gallery/classrooms/first-day-girls-02.jpeg",
    alt: "مجموعة بنات صغيرات في أول يوم بالروضة",
    title: "أول يوم – الروضة",
    description:
      "بنات صغيرات يرتدين الزي المدرسي في أول يوم لهن بالروضة.",
    category: "classrooms",
  },
  {
    id: "first-day-boy-01",
    src: "/images/school-gallery/classrooms/first-day-boy-01.jpeg",
    alt: "طفل في أول يوم دراسي أمام باص المدرسة في قناديل العلم",
    title: "أول يوم – ولد",
    description:
      "طفل يقف بثقة أمام ديكور باص المدرسة في أول يوم دراسي.",
    category: "classrooms",
  },
  {
    id: "first-day-girl-01",
    src: "/images/school-gallery/classrooms/first-day-girl-01.jpeg",
    alt: "طفلة في أول يوم دراسي بمدرسة قناديل العلم (مرحلة الروضة)",
    title: "أول يوم – بنت",
    description:
      "طفلة بزيها المدرسي الأنيق في أول يوم لها بالروضة.",
    category: "classrooms",
  },
  {
    id: "first-day-girl-02",
    src: "/images/school-gallery/classrooms/first-day-girl-02.jpeg",
    alt: "طفلة سعيدة في أول يوم دراسي",
    title: "فرحة أول يوم",
    description:
      "طفلة ترفع علامة النصر فرحًا بأول يوم في المدرسة.",
    category: "classrooms",
  },
  {
    id: "first-day-boys-01",
    src: "/images/school-gallery/classrooms/first-day-boys-01.jpeg",
    alt: "أولاد يحملون ألواح تعليمية في أول يوم بالروضة",
    title: "أول يوم – أولاد",
    description:
      "مجموعة أولاد يحملون ألواح تعليمية جديدة في أول يوم دراسي.",
    category: "classrooms",
  },
  {
    id: "first-day-girl-03",
    src: "/images/school-gallery/classrooms/first-day-girl-03.jpeg",
    alt: "طفلة بزيها المدرسي أمام ديكور أول يوم في الروضة",
    title: "ابتسامة أول يوم",
    description:
      "طفلة مبتسمة بزيها المدرسي أمام ديكور الترحيب بالعام الجديد.",
    category: "classrooms",
  },

  // ═══════════════════════════════════════════
  // المرافق — Facilities
  // ═══════════════════════════════════════════
  {
    id: "facility-courtyard-01",
    src: "/images/school-gallery/facilities/facility-courtyard-01.jpeg",
    alt: "ساحة مدرسة قناديل العلم (مرحلة الروضة) الداخلية مع عشب صناعي وجدران ملونة",
    title: "ساحة الروضة",
    description:
      "ساحة داخلية واسعة بعشب صناعي وأعمدة مزينة وجدران تعليمية ملونة.",
    category: "facilities",
    featured: true,
  },
];

export const featuredGalleryImages = galleryImages.filter(
  (image) => image.featured,
);
