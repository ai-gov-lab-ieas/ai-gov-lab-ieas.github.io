export interface Member {
  slug: string;        // URL segment: /people/<slug>/
  name: string;        // "Chih-Hsing Ho (何之行)" — combined display name
  name_en: string;
  name_zh: string;
  role_zh: string;
  role_en: string;
  image: string;       // path under public/
  bio_zh: string;      // 80-120 words, drafted from institutional profile
  bio_en: string;
  url: string;         // official institutional profile (used as sameAs)
  tags: string[];
}

export const MEMBERS: Member[] = [
  {
    slug: 'chih-hsing-ho',
    name: 'Chih-Hsing Ho (何之行)',
    name_en: 'Chih-Hsing Ho',
    name_zh: '何之行',
    role_zh: '計畫主持人 / 副研究員',
    role_en: 'Project Coordinator / Associate Research Fellow',
    image: '/images/team/Chih-Hsing-Ho.jpg',
    bio_zh:
      '何之行現任中央研究院歐美研究所副研究員，自二○二一年二月起獲聘為專任研究人員，並擔任 AI 治理觀念實驗室計畫主持人。她畢業於倫敦政治經濟學院法學博士，並曾取得史丹佛大學法學碩士（J.S.M.）、哥倫比亞大學法學碩士（LL.M.）及國立台灣大學法學士學位。其研究領域涵蓋轉譯醫學與生物資料庫之法律議題、巨量資料與隱私及個人資料保護法、人工智慧治理與法律、法律與全球健康，以及法律人類學。自二○一九年起，她同時擔任香港大學醫學倫理與法律中心研究員，並曾多次獲得國家科學及技術委員會傑出學者研究獎。',
    bio_en:
      'Chih-Hsing Ho is an Associate Research Fellow at the Institute of European and American Studies, Academia Sinica, tenured since February 2021, and coordinates the AI Governance Laboratory. She holds a Ph.D. in Law from the London School of Economics and Political Science, a J.S.M. from Stanford Law School, an LL.M. from Columbia Law School, and an LL.B. from National Taiwan University. Her research spans legal aspects of translational medicine and biobanking, big data, privacy and data protection law, AI governance and law, law and global health, and law and anthropology. She has also been a Research Fellow at the Centre for Medical Ethics and Law, University of Hong Kong, since 2019, and has repeatedly received the National Science and Technology Council Award for Outstanding Scholars.',
    url: 'https://www.ea.sinica.edu.tw/people/Chih-hsing-Ho.aspx?lang=e',
    tags: [],
  },
  {
    slug: 'cheng-hung-tsai',
    name: 'Cheng-Hung Tsai (蔡政宏)',
    name_en: 'Cheng-Hung Tsai',
    name_zh: '蔡政宏',
    role_zh: '研究員',
    role_en: 'Research Fellow',
    image: '/images/team/Cheng-Hung-Tsai.jpg',
    bio_zh:
      '蔡政宏現任中央研究院歐美研究所研究員，自二○一八年起服務於該所。他於二○○六年取得國立台灣大學哲學博士學位，博士論文題目為〈德性語意學：邁向以行動者為基礎的語言理解理論〉。其研究專長包括智能與智能行動之哲學、知識論與德性理論、語言哲學與心靈哲學、實踐智慧（phronesis），以及人工智慧與機器倫理學。他提出「德性語意學」處理語言理解問題、「混合技能」實踐知識理論，以及探討複雜情境下實踐推理與決策的「智慧的專長理論」等三項理論架構。自二○二三年起擔任《歐美研究》期刊主編，並曾主持台灣哲學學會（自二○一五年起）。他曾獲國家科學及技術委員會傑出研究獎（二○二五年）及吳大猷先生紀念獎（二○一四年）。',
    bio_en:
      'Cheng-Hung Tsai is a Research Fellow at the Institute of European and American Studies, Academia Sinica, where he has worked since 2018. He earned his Ph.D. in Philosophy from National Taiwan University in 2006 with a dissertation titled "Virtue Semantics: Towards an Agent-Based Theory of Linguistic Understanding." His research covers the philosophy of intelligence and intelligent action, epistemology and virtue theory, philosophy of language and mind, practical wisdom (phronesis), and artificial intelligence and machine ethics. He has developed three theoretical frameworks: virtue semantics addressing linguistic understanding, a hybrid-skill theory of practical knowledge, and an expertise theory of wisdom examining practical reasoning in complex situations. He has served as Editor-in-Chief of EurAmerica since 2023 and previously directed the Taiwan Philosophical Association. He received the Outstanding Research Award from the National Science and Technology Council in 2025 and the Ta-You Wu Memorial Award in 2014.',
    url: 'https://www.ea.sinica.edu.tw/people/Cheng-Hung-Tsai.aspx?lang=e',
    tags: [],
  },
  {
    slug: 'tzu-wei-hung',
    name: 'Tzu-Wei Hung (洪子偉)',
    name_en: 'Tzu-Wei Hung',
    name_zh: '洪子偉',
    role_zh: '研究員',
    role_en: 'Research Fellow',
    image: '/images/team/Tzu-Wei-Hung.jpg',
    bio_zh:
      '洪子偉現任中央研究院歐美研究所研究員，自二○二三年起服務於該所。他於二○一一年取得倫敦國王學院哲學博士學位，二○○七年取得該校心理學哲學碩士學位，並於一九九九年取得國立台灣大學哲學學士學位。其研究專長涵蓋認知科學哲學、語言哲學、人工智慧哲學、社會哲學，以及台灣哲學等五大領域，研究重點包括預測處理歷程、演算法公平性、認知戰，以及台灣哲學思想史。他於二○二四至二○二六年擔任台灣哲學學會理事長，並主編《台灣哲學百年選輯》系列叢書，同時為中央研究院生成式人工智慧諮詢委員會成員。他曾獲國家科學及技術委員會二○二二至二○二三年度傑出研究獎。',
    bio_en:
      'Tzu-Wei Hung is a Research Fellow at the Institute of European and American Studies, Academia Sinica, where he has worked since 2023. He holds a Ph.D. in Philosophy from King\'s College London (2011), an MPhilStud in Philosophy of Psychology from the same institution (2007), and a B.A. in Philosophy from National Taiwan University (1999). His research spans five areas: philosophy of cognitive science, philosophy of language, philosophy of artificial intelligence, social philosophy, and Taiwanese philosophy, with particular emphasis on predictive processing, algorithmic fairness, cognitive warfare, and the history of Taiwanese philosophical thought. He served as President of the Taiwan Philosophical Association (2024–2026), is editor-in-chief of the Centennial Anthology of Taiwanese Philosophy Series, and is a member of Academia Sinica\'s Generative Artificial Intelligence Advisory Committee. He received the National Science and Technology Council\'s Outstanding Research Award for 2022–2023.',
    url: 'https://www.ea.sinica.edu.tw/people/Tzu-Wei-Hung.aspx?lang=e',
    tags: [],
  },
  {
    slug: 'hung-ju-chen',
    name: 'Hung-Ju Chen (陳弘儒)',
    name_en: 'Hung-Ju Chen',
    name_zh: '陳弘儒',
    role_zh: '助研究員',
    role_en: 'Assistant Research Fellow',
    image: '/images/team/Hung-Ju-Chen.jpg',
    bio_zh:
      '陳弘儒現任中央研究院歐美研究所助研究員。他於二○一一至二○一七年間取得喬治城大學法學博士（S.J.D.），並曾取得美國伊利諾大學厄巴納－香檳分校法學碩士（二○一○至二○一一年）與國立台灣大學法學碩士（二○○三至二○○七年），以及世新大學法學士（一九九九至二○○三年）學位。其研究專長包括法理學、政治哲學、憲法解釋理論、契約法基本理論，以及人工智慧法律研究。他自二○二三年起擔任中央研究院 AI 治理觀念實驗室主持人，並自二○二一年起擔任台灣法理學會（IVR 台灣分會）理事，同時自二○二三年起為該所圖書室執行委員會委員。',
    bio_en:
      'Hung-Ju Chen is an Assistant Research Fellow at the Institute of European and American Studies, Academia Sinica. He earned an S.J.D. from Georgetown University (2011–2017), an LL.M. from the University of Illinois at Urbana-Champaign (2010–2011), an LL.M. from National Taiwan University (2003–2007), and an LL.B. from Shih-Hsin University (1999–2003). His research expertise covers jurisprudence, political philosophy, theories of constitutional interpretation, fundamental theories of contract law, and studies in artificial intelligence law. He has directed the AI Governance Laboratory at Academia Sinica since 2023, has served as Director of the Taiwan Association for Philosophy of Law and Social Philosophy (IVR Taiwan Section) since 2021, and has been an Executive Committee Member of the Institute\'s Library since 2023.',
    url: 'https://www.ea.sinica.edu.tw/people/Hung-Ju-Chen.aspx?lang=e',
    tags: [],
  },
  {
    slug: 'jay-jian',
    name: 'Jay Jian (簡士傑)',
    name_en: 'Jay Jian',
    name_zh: '簡士傑',
    role_zh: '助研究員',
    role_en: 'Assistant Research Fellow',
    image: '/images/team/Jay-Jian.jpeg',
    bio_zh:
      '簡士傑現任中央研究院歐美研究所助研究員，自二○二二年八月起獲聘為專任研究人員。他於二○一五至二○二○年間就讀牛津大學貝利奧爾學院，取得哲學博士（DPhil）學位，並曾於二○一三至二○一五年在牛津大學王后學院取得哲學學士後學位（BPhil），以及二○○六至二○一一年於國立台灣大學取得法學士與哲學學士雙學位。其研究興趣包括後設倫理學、行動哲學、倫理學、理性，以及規範性等議題。他近期論文發表於《澳洲哲學期刊》（二○二三年）與《哲學研究》（二○二一年），並有一篇論文即將刊登於《Episteme》期刊。',
    bio_en:
      'Jay Jian is an Assistant Research Fellow at the Institute of European and American Studies, Academia Sinica, in a tenure-track position since August 2022. He completed a DPhil in Philosophy at Balliol College, University of Oxford (2015–2020), a BPhil in Philosophy at The Queen\'s College, Oxford (2013–2015), and a Bachelor of Laws and Bachelor of Arts in Philosophy at National Taiwan University (2006–2011). His research interests include metaethics, philosophy of action, ethics, rationality, and normativity. His recent work has appeared in the Australasian Journal of Philosophy (2023) and Philosophical Studies (2021), with a further paper forthcoming in Episteme.',
    url: 'https://www.ea.sinica.edu.tw/Content_People_Page.aspx?pid=4&uid=8&peoid=203&lang=e',
    tags: [],
  },
  {
    slug: 'bow-yaw-wang',
    name: 'Bow-Yaw Wang (王柏堯)',
    name_en: 'Bow-Yaw Wang',
    name_zh: '王柏堯',
    role_zh: '資訊所研究員',
    role_en: 'Research Fellow, IIS',
    image: '/images/team/Bow-Yaw-Wang.jpg',
    bio_zh:
      '王柏堯現任中央研究院資訊科學研究所研究員，辦公室位於台北市南港區研究院路二段一二八號。他的研究領域以形式化驗證（formal verification）為核心，這是一種分析系統行為以提升系統品質的技術，應用範圍涵蓋硬體、通訊協定、驅動程式與作業系統。他也致力於發展以布林可滿足性（SAT）為基礎的模型檢驗，將歸納證明推廣至硬體電路分支時間性質的驗證。此外，他發展以演算法學習為基礎的推理技術，用於並行傳統系統與機率系統的假設保證推理，並將演算法學習應用於推導迴圈不變式與終止性證明。其研究亦涵蓋資料平行運算程式的正確性驗證，以及資料分析系統中隱私之形式化與驗證。',
    bio_en:
      'Bow-Yaw Wang is a Research Fellow at the Institute of Information Science, Academia Sinica, located at No. 128, Academia Road, Section 2, Nankang, Taipei. His research centers on formal verification, a technique for analyzing system behaviors to improve system quality, applied across hardware, protocols, drivers, and operating systems. He works on SAT-based model checking, which generalizes inductive proofs to verify branching-time properties of hardware circuits, and on learning-based reasoning, including assume-guarantee reasoning techniques for concurrent classical and probabilistic systems. His work also uses algorithmic learning to infer loop invariants and termination proofs for imperative programs, addresses correctness issues in data-parallel computing, and formalizes privacy together with verification techniques for privacy-respecting mechanisms in data analysis systems.',
    url: 'https://homepage.iis.sinica.edu.tw/pages/bywang/index_en.html',
    tags: [],
  },
  {
    slug: 'tyng-ruey-chuang',
    name: 'Tyng-Ruey Chuang (莊庭瑞)',
    name_en: 'Tyng-Ruey Chuang',
    name_zh: '莊庭瑞',
    role_zh: '資訊所副研究員',
    role_en: 'Associate Research Fellow, IIS',
    image: '/images/team/Tyng-Ruey-Chuang.jpg',
    bio_zh:
      '莊庭瑞現任中央研究院資訊科學研究所副研究員，辦公室位於台北市南港區研究院路二段一二八號。他於一九八七至一九九三年間取得美國紐約大學電腦科學博士學位，並曾於一九八七至一九九○年間取得同校電腦科學碩士學位，以及一九八○至一九八四年於國立台灣大學取得資訊工程學士學位。其研究興趣涵蓋五大領域：函數式程式設計、程式語言與系統、XML 與網頁技術、開放地理空間資訊處理，以及資訊科技的社會影響。這些研究興趣橫跨電腦科學的技術基礎議題，以及科技發展與應用對社會層面的廣泛影響。',
    bio_en:
      'Tyng-Ruey Chuang is an Associate Research Fellow at the Institute of Information Science, Academia Sinica, located at No. 128, Academia Road, Section 2, Nankang, Taipei. He holds a Ph.D. in Computer Science from New York University (1987–1993), an M.S. in Computer Science from the same institution (1987–1990), and a B.S. in Computer Science and Information Engineering from National Taiwan University (1980–1984). His research interests span five areas: functional programming, programming languages and systems, XML and web technologies, open geospatial information processing, and the social implications of information technologies — spanning both technical foundations of computer science and the broader societal dimensions of technology development.',
    url: 'https://homepage.iis.sinica.edu.tw/pages/trc/index_en.html',
    tags: [],
  },
];
