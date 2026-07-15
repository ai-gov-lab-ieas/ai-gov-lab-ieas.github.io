export interface Member {
  slug: string;        // URL segment: /people/<slug>/
  name: string;        // "Chih-Hsing Ho (何之行)" — combined display name
  name_en: string;
  name_zh: string;
  role_zh: string;
  role_en: string;
  image: string;       // path under public/
  // Structured excerpt from the institutional profile. Convention:
  //   `## Heading` = section, `- item` = list bullet, blank line = paragraph break.
  // Rendered by renderBioHtml() on the HTML page and passed through verbatim in
  // the markdown mirror / llms-full.txt.
  bio_zh: string;
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
    bio_zh: `## 主要經歷

- 中央研究院歐美研究所副研究員（2/2021 迄今）
- 中央研究院資訊科技創新研究中心合聘副研究員（2021–2024）
- 香港大學醫學倫理與法律研究中心研究員（2/2019 迄今）
- 數位發展部人權工作小組委員（3/2026 迄今）
- 數位發展部訴願審議及國賠小組委員（2/2026 迄今）
- 數位發展部數位經濟發展諮詢會委員（3/2025 迄今）
- 衛福部科技政策諮詢小組委員（9/2023 迄今）
- 國家級人體生物資料庫整合平台審查小組委員（6/2022 迄今）
- 衛福部生技法規策略諮議會委員（2022–2025）
- 衛福部數位健康指導委員會委員（2022–2024）
- 衛福部人體生物資料庫審查小組委員（2019–2023）
- 醫策會人體生物資料庫查核制度專家諮詢小組委員（2019–2022）
- 國家級人體生物資料庫整合平台諮詢暨審查專家委員會委員（2019–2022）
- 中央研究院資訊科技創新研究中心合聘助研究員（2020–2021）
- 中央研究院歐美研究所助研究員（4/2014–2/2021）
- 香港大學醫學倫理與法律研究中心研究主任（1/2013–4/2014）

## 研究主題

- 轉譯醫學暨人體生物資料庫法律研究
- 巨量資料、隱私與個人資料保護法
- 人工智慧法律與治理
- 法律、醫學與全球衛生
- 法律人類學`,
    bio_en: `## Professional Experience

- Associate Research Fellow / Associate Professor (tenured), Institute of European and American Studies, Academia Sinica (2/2021–present)
- Associate Research Fellow, Research Center for Information Technology Innovation, Academia Sinica (2021–2024, joint appointment)
- Research Fellow, Centre for Medical Ethics and Law, University of Hong Kong (2/2019–present)
- Committee Member, Human Rights Working Group, Ministry of Digital Affairs (3/2026–present)
- Committee Member, Administrative Appeals and State Compensation, Ministry of Digital Affairs (2/2026–present)
- Advisory Committee on Digital Economy Development, Ministry of Digital Affairs, Taiwan (3/2025–present)
- Technology Policy Advisory Committee, Ministry of Health and Welfare, Taiwan (9/2023–present)
- Review Board, National Biobank Consortium of Taiwan (6/2022–present)
- Advisory Committee on Biotechnology Regulatory Law and Strategies, Ministry of Health and Welfare, Taiwan (2022–2025)
- Steering Committee on Digital Health, Ministry of Health and Welfare, Taiwan (2022–2024)
- Biobank Ethics and Governance Council, Ministry of Health and Welfare, Taiwan (2019–2023)
- Consultation Board for Biobank Accreditation, Joint Commission of Taiwan (2019–2022)
- Consultation and Review Board, National Biobank Consortium of Taiwan (2019–2022)
- Assistant Research Fellow, Research Center for Information Technology Innovation, Academia Sinica (2020–2021, joint appointment)
- Assistant Research Fellow, Institute of European and American Studies (4/2014–2/2021)
- Research Officer, Centre for Medical Ethics and Law, University of Hong Kong (1/2013–4/2014)

## Areas of Expertise

- Legal Aspects of Translational Medicine and Biobanking
- Big Data, Privacy and Data Protection Law
- AI Governance and Law
- Law, Medicine and Global Health
- Law and Anthropology`,
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
    bio_zh: `我的研究領域為智能哲學（philosophy of intelligence），主要關注的現象是「智能行動」（intelligent action）。儘管人類每日展現出各式各樣的行為，但並非所有行為皆屬於智能行動；我的研究聚焦於那些能體現智能或技藝（skill）的行為類型，探討的哲學問題包括：(1) 為何人類能透過有限語句的學習，就能掌握和理解其從未接觸過的語句？(2) 為何在道德規則無法為複雜情境提供清楚指引時，人類仍能做出正確的道德判斷與行動？(3) 上述兩問題可視為是以下這個更根本問題的特例：在特定領域中，人類是如何在充滿複雜與不確定性的情境中思考與行動，以致可成功且穩定地實現該領域的特定目標？透過探究這些問題，我的研究試圖揭示智能的本質與深層結構，並進一步闡明心智、知識與行動之間的聯繫。

回顧至今的學術研究歷程，我的研究大致可分為三個階段，並相應於上述三個問題做出了三項重要的學術貢獻。第一階段（博士階段），我的研究主題是語言知識與語言能力之間的關係，聚焦於 Donald Davidson 與 Michael Dummett 等當代英美哲學家的意義理論，並提出「德性語意學」（virtue semantics）這項主張。在第二階段，我致力於為實踐知識（knowledge how）提供理論說明，發展出一套承接但超越英國哲學家 Gilbert Ryle 之反智識主義（anti-intellectualism）的「混合技藝」（hybrid skill）概念，以此闡明實踐知識的本質與結構。

在第三階段的近十年研究中，我持續深化混合技藝概念，並進一步以技藝概念為基礎來形塑「實踐智慧」（phronesis; practical wisdom）。實踐智慧是一種卓越的實踐推理，然而其內涵與習得方式仍存在諸多爭議與未解之謎。為回應這些挑戰，我提出「智慧之專技理論」（the expertise theory of wisdom），論證智慧應被視為一種技藝，確立其必要條件，界定其中福祉內涵，並回應相關理論挑戰。這套哲學理論亦具跨領域意涵，可作為智慧心理學（the psychology of wisdom）的概念基礎。在智慧研究中，我亦關注「情感革命」，深入探討情感在智慧中的作用。我提出「智者情感之技藝說明」（the skill account of the emotions of the wise），作為「智慧之專技理論」的增補，進一步完善我的智慧研究理論體系。

智慧研究同時具有基礎理論探索與社會實踐應用的雙重價值。一方面，智慧作為一種卓越的實踐推理能力，涉及在複雜情境中進行判斷與決策，可作為哲學與心理學在心智探究上的重要對象。另一方面，智慧研究也有助於探討和理解當代社會所需的「政治智慧」、「公民智慧」等具體實踐能力，促進社會議題的深入討論與解決。我目前的智慧研究也拓展至當前廣受關注的人工智能（AI）領域，從哲學角度探討 AI 對於人類思維與福祉的影響，以及「人造智慧」（artificial wisdom）在理論上與實踐上的可能性，並為機器倫理學的未來發展提供嶄新的研究視角與方向。`,
    bio_en: `My research area is the philosophy of intelligence, with a core focus on the phenomenon of intelligent action. While humans perform a wide variety of actions daily, not all actions qualify as intelligent actions; only certain actions reveal underlying special mental states or qualities, such as intelligence or skill. The primary philosophical questions I investigate include: (1) How can humans, through learning only a limited number of sentences, grasp and understand infinitely many sentences, including those never previously encountered? (2) How can humans still make moral judgments and take actions that mutually benefit one another when explicit moral rules do not provide clear guidance in complex situations? (3) These two questions can be seen as special cases of a more fundamental question: How do humans think and act within a specific domain when faced with uncertainty and complexity, successfully and reliably achieving domain-specific goals? By exploring these questions, my research aims to uncover the nature and deep structure of intelligence while further elucidating the relationships among mind, knowledge, and action.

Reflecting on my academic journey, my research can be broadly divided into three stages, each corresponding to one of the three questions above and making significant contributions to these areas of inquiry. In the first stage (doctoral research), my work focused on the relationship between linguistic knowledge and linguistic competence, engaging with theories of meaning proposed by contemporary analytic philosophers such as Donald Davidson and Michael Dummett. I proposed a virtue-theoretic approach to semantics, called virtue semantics, as a novel perspective on linguistic understanding. In the second stage, I worked on developing a theoretical account of knowledge-how, formulating the conception of hybrid skill, which builds upon yet surpasses the anti-intellectualism of British philosopher Gilbert Ryle. This conception elucidates the nature and structure of practical knowledge.

In the third stage of my research, spanning roughly the past decade, I have deepened the conception of hybrid skill, using it as a foundation to construct a theory of practical wisdom (phronesis). Practical wisdom is the most excellent form of practical reasoning, yet debates persist regarding its nature and acquisition. In response to these challenges, I proposed the expertise theory of wisdom, arguing that wisdom should be regarded as a skill. I have specified the necessary conditions for wisdom-as-skill, defined its conception of well-being, and addressed theoretical objections. This philosophical theory has interdisciplinary implications, providing a conceptual foundation for the psychology of wisdom. Additionally, my research on wisdom engages with the emotional revolution, examining the role of emotions in wisdom in depth. I developed the skill account of the emotions of the wise as a supplement to the expertise theory of wisdom, further refining my theoretical framework for the study of wisdom.

The study of wisdom holds both theoretical and practical value. On one hand, wisdom, as an excellence in practical reasoning, plays a crucial role in judgment and decision-making in complex situations, and in this regard, it serves as a valuable subject for philosophical and psychological inquiries into the mind. On the other hand, wisdom research contributes to understanding the practical capacities needed in contemporary society, such as political wisdom and civic wisdom, fostering deeper discussions and solutions for social issues. Currently, my wisdom research extends to the rapidly evolving field of artificial intelligence (AI), examining how AI impacts human cognition and well-being from a philosophical perspective. I also explore the theoretical and practical possibility of artificial wisdom, offering novel perspectives and directions for the future development of machine ethics.`,
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
    bio_zh: `## 主要經歷

- 中研院歐美所研究員（2023–）
- 臺灣哲學學會會長（2024–2026）
- 美國史丹佛大學行為科學高等研究中心研究員（STSS Fellowship, 2022–2023）
- 美國哈佛燕京學社訪問學人獎助獲獎（declined，赴 Stanford 客座）
- 國際科學史與科學哲學學會 LMPS-TAIWAN 執行秘書（2015–2019）、監事（2020–）
- 中研院歐美所助研究員（2012–2017）、副研究員（2017–2023）
- 國立台灣大學哲學系專任助理教授聘書獲聘（declined，赴中研院任職）
- 台灣民間真相與和解促進會會員（2009–）、理事（2019–2023）
- 英國國際特赦組織倫敦分組代表（2009）、分組網路負責人／倫敦街訪員（2006–2012）
- 非洲烏干達北部村落巡迴衛教講習員、盧安達地區級醫院 HIV/AIDS 部門助理（2009）
- 空降特戰部隊營搜索排、特戰班班長（1999–2001，自願加入特戰）
- 緊急醫療初級救護技術員（1996–1999）、新制 EMT-1（2023–）
- 基隆海洋之聲主持人（1996）、臺灣勞工陣線義工（1997–1998）、女學會學生義工（1996）、勵馨基金會街頭行動劇演員（1995）

## 研究主題

- 認知科學哲學
- 語言哲學
- 人工智慧哲學
- 社會哲學

## 研究計畫

- 2026–2030 知識不正義：生成式內容、資訊循環與詮釋空隙（115-2410-H-001-010-MY4）
- 2024–2025 Governing Generative AI for a Future Society（AS-GCS113-H04）
- 2023–2026 偏見、社會對立與認知戰（112-2410-H-001-031-MY3）
- 2021–2023 偏見與歧視：從預測編碼分析社會不平等（110-2628-H-001-005-MY2）
- 2018–2021 理解社會溝通：知覺運動模型與預測編碼理論（107-2410-H-001-101-MY3）
- 2016–2018 語言與社會認知（105-2628-H-001-004-MY2）
- 2014–2016 知覺運動系統與語言處理（103-2410-H-001-095-MY2）
- 2012–2014 從行為模仿到語句模仿：社會認知的計算模型（101-2410-H-001-100-MY2）`,
    bio_en: `## Professional Experience

- Research Fellow, Institute of European and American Studies, Academia Sinica, Taiwan (2023–Present)
- President, Taiwan Philosophical Association (2024–2026)
- STSS Fellow, Center for Advanced Study in the Behavioral Sciences at Stanford University, USA (2022–2023)
- [Declined] Visiting Scholars Program, Harvard-Yenching Institute, Cambridge, USA (2022–2023)
- Executive Secretary (2015–2019) and supervisor (2020–), National Committee for the Division of Logic, Methodology, & Philosophy of Science, International Union of History and Philosophy of Science and Technology
- Assistant Research Fellow (2012–2017) & Associate Research Fellow (2017–2023), Institute of European and American Studies, Academia Sinica, Taiwan
- [Declined] Tenure-track assistant professor, Department of Philosophy, National Taiwan University (2012)
- Member (2009–) and board member (2019–2023), Taiwan Association for Truth and Reconciliation
- Representative of H&F group for London Region, Amnesty International UK (2009)
- Hospital assistant for HIV/AIDS prevention, Kimironko Health Center, Kigali, Rwanda (2009); Volunteer for AIDS and domestic violence prevention, MACRO, Uganda (2009)
- Paratrooper, Aviation and Special Forces Command, Taiwan Army (1999–2001)
- Emergency medical technician (1996–1999; 2023–)
- Radio host, Voice of Ocean Radio Keelung (1996)

## Areas of Expertise

- Philosophy of Cognitive Science
- Philosophy of Language
- Philosophy of Artificial Intelligence
- Social Philosophy
- Taiwanese Philosophy`,
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
    bio_zh: `## 主要經歷

- 東海大學法律學系兼任助理教授（2024/02–2024/07；2024/09–2025/01；2025/02–2025/07）
- 中央研究院歐美研究所助研究員（2020/02 迄今）
- 國立清華大學通識教育中心兼任助理教授（2020/02–2024/01，多學期聘任）
- 國立清華大學通識教育中心專任助理教授（2019/02–2020/01）
- 中央研究院法學研究所博士後研究人員（2017/07–2019/01）
- 世新大學法律學系兼任助理教授（2018/03–2018/07）
- 世新大學法律學系兼任講師（2008/08–2010/07；2014/08–2015/07）

## 研究主題

- 法理學
- 政治哲學
- 美國憲法解釋理論
- 契約法基礎理論
- 人工智慧與法律`,
    bio_en: `## Professional Experience

- Adjunct Assistant Professor, The College of Law, Tunghai University (2024/02–2024/07; 2024/09–2025/01; 2025/02–2025/07)
- Assistant Research Fellow, Institute of European and American Studies, Academia Sinica (2020/02–)
- Adjunct Assistant Professor, Center for General Education, National Tsing Hua University (2020/02–2024/01, multiple semester appointments)
- Assistant Professor, Center for General Education, National Tsing Hua University (2019/02–2020/01)
- Post-Doctoral Researcher, Academia Sinica (2017/07–2019/01)
- Adjunct Assistant Professor, The College of Law, Shih-Hsin University (2018/03–2018/07)
- Adjunct Lecturer, The College of Law, Shih-Hsin University (2008/08–2010/07; 2014/08–2015/07)

## Areas of Expertise

- Jurisprudence
- Political Philosophy
- Theories of Constitutional Interpretation
- Fundamental Theories of Contract Law
- AI and Law`,
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
    bio_zh: `## 主要經歷

- 中央研究院歐美研究所助研究員（2022/08 迄今）
- 國立清華大學哲學研究所專任助理教授（2021/08–2022/07）
- 國立清華大學哲學研究所博士後研究員（2021/01–2021/07）
- 牛津大學聖約翰學院無給講師（2016/10–2017/01；2017/10–2018/01）

## 研究主題

- 後設倫理學
- 行動哲學
- 倫理學
- 理性
- 規範性`,
    bio_en: `## Professional Experience

- Tenure-Track Assistant Research Fellow, Institute of European and American Studies, Academia Sinica (2022/08–)
- Tenure-Track Assistant Professor, Institute of Philosophy, National Tsing Hua University (08/2021–07/2022)
- Postdoctoral Researcher, Institute of Philosophy, National Tsing Hua University (01/2021–07/2021)
- Non-stipendiary Lecturer, St John's College, University of Oxford (10/2016–01/2017; 10/2017–01/2018)

## Areas of Expertise

- Meta-ethics
- Philosophy of Action
- Ethics
- Rationality
- Normativity`,
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
    bio_zh: `形式化驗證是一種分析系統行為，藉以增進系統品質之技術。過去三十年來，形式化驗證已在學界和業界有顯著之影響。從硬體電路和網路協定，到驅動程式、作業系統、編譯器，形式化驗證在設計高品質系統為一基本要素。

在過去幾年，我在不同的計算模型上研究各類形式化驗證之技術。以 SAT 為基礎的局部模型檢測，將硬體電路上之歸納證明推廣至驗證分支時序的性質。也為了古典與機率之並行系統，發展了幾個學習為基礎的組合式分析技術。演算式學習亦被應用於基本程式上，以推導廻圈不變式及中止性證明。我的研究目標在應用理論想法，以增進形式化驗證。

在未來，我計劃為形式化驗證探索新的應用。在平行資料計算中，開發者在新的平行程式模型上寫程式。不同於一般的平行計算，這些程式模型為了資料分析進行最佳化，而有固定的通訊模式。新的程式錯誤也同時被引進這些新的模型中。在過去，研究界大部份注重在平行資料計算上之新奇的應用。資料分析程式之正確性則多半被忽略。我最近的研究成果希望能引起形式化驗證界的注意。

另外一個有趣的應用是資料分析之隱私問題。在大數據的時代，隱私權無疑是一項熱門的課題。研究界也試著在理論及實務上，發展尊重隱私的機制。但是一個不正確的實作，能導致隱私的侵犯。我們必須分析具體的實作以確保個人之隱私。這無疑為形式化驗證開了扇大門。為了應用形式化驗證，隱私必須被形式化。同時也需要新的驗證技術。我希望我的研究，在不久的未來能為這個問題提出一些新的看法。`,
    bio_en: `Formal verification is a technique which analyzes system behaviors and hence improves system quality. For the past three decades, formal verification has significant impacts on both academics and industry. From hardware circuits and network protocols, to device drivers, operating systems, and compilers, formal verification is essential to the design of high-quality systems.

For the past years, I have been working on various formal verification techniques in different computation models. The SAT-based local model checking generalizes inductive proofs to verify branching time properties on hardware circuits. Several learning-based assume-guarantee reasoning techniques are also developed for concurrent classical and probabilistic systems. Algorithmic learning is also applied to infer loop invariants and termination proofs on imperative programs. My researches aim to advance practical formal verification by applying theoretical ideas.

In the near future, I plan to explore new applications for formal verification. In data parallel computing, developers write programs in new parallel programming models. Unlike models for general parallel computation, such programming models are optimized for data analysis and have fixed communication patterns. New programming errors are also introduced by new models. In the past, research communities mostly focus on exciting applications of data parallel computation. Correctness of parallel data analysis programs is often overlooked. My recent work tries to bring attention to the formal verification community.

Another application of interest is privacy issues in data analysis. Privacy is undoubtedly a hot topic in the age of big data. Research communities have also tried to develop privacy-respecting mechanisms in both theory and practice. Yet an ill-implemented mechanism can lead to privacy intrusion. One has to analyze implementations to attain one's privacy. This clearly opens the door for formal verification. In order to apply formal verification, privacy has to be formalized. New verification techniques are also needed. Hopefully, my current research will give some insights to the problem in the near future.`,
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
    bio_zh: `I am an associate research fellow in the Institute of Information Science, Academia Sinica (located at Taipei, Taiwan). My research interests include functional programming, programming languages and systems, XML and Web technologies, open geospatial information processing, and social implications of information technologies. I am jointly appointed at the Research Center for Information Technology Innovation, Academia Sinica, as an associate research fellow, and at the Department of Information Management, National Taiwan University, as an Associate Professor. I served as a deputy director of the Institute from July 2004 to September 2008.

I was a guest researcher at the Department of Computing Science, Chalmers University of Technology, Sweden, before joining the Institute as an assistant research fellow in January 1994. I graduated with a BS degree in Computer Science and Information Engineering from National Taiwan University in 1984. I received my MS and PhD degrees in Computer Science from New York University in 1990 and 1993, respectively.`,
    bio_en: `I am an associate research fellow in the Institute of Information Science, Academia Sinica (located at Taipei, Taiwan). My research interests include functional programming, programming languages and systems, XML and Web technologies, open geospatial information processing, and social implications of information technologies. I am jointly appointed at the Research Center for Information Technology Innovation, Academia Sinica, as an associate research fellow, and at the Department of Information Management, National Taiwan University, as an Associate Professor. I served as a deputy director of the Institute from July 2004 to September 2008.

I was a guest researcher at the Department of Computing Science, Chalmers University of Technology, Sweden, before joining the Institute as an assistant research fellow in January 1994. I graduated with a BS degree in Computer Science and Information Engineering from National Taiwan University in 1984. I received my MS and PhD degrees in Computer Science from New York University in 1990 and 1993, respectively.`,
    url: 'https://homepage.iis.sinica.edu.tw/pages/trc/index_en.html',
    tags: [],
  },
];
