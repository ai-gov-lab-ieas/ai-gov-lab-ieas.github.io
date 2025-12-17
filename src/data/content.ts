// This file contains all the text content for the website.
// Edit this file to update text without touching the code.

export type Lang = 'zh' | 'en';

export const CONTENT = {
  zh: {
    site: {
      title: "AI 治理觀念實驗室 - 中研院歐美所",
      name: "AI 治理觀念實驗室"
    },
    nav: {
      mission: "實驗室簡介",
      research: "研究領域",
      team: "參與成員",
      events: "學術活動",
    },
    hero: {
      label: "中研院歐美研究所",
      title_line1: "治理",
      title_highlight: "人工智慧",
      title_line2: "的未來",
      desc: "積極投入生成式 AI 的治理，藉由全球規範和在地形制的對話，進一步豐富全球 AI 治理的討論。",
      scroll: "向下探索"
    },
    mission: {
      title: "計畫緣起及目的",
      main_quote: "科技不存於真空。它被社會形塑，也形塑著社會。",
      box1_title: "黑箱問題",
      box1_desc: "解決演算法透明度與可解釋性的挑戰。",
      box2_title: "在地觀點",
      box2_desc: "以台灣繁體中文使用者的視角，參與全球 AI 規範制定。",
      box3_title: "跨域對話",
      box3_desc: "法律 x 哲學 x 資訊科學"
    },
    team: {
      title: "參與成員",
      subtitle: "",
      join_title: "聯繫我們",
      join_desc: "",
      collaborators_title: "合作夥伴",
      collaborators_desc: "查看合作學者"
    },
    activities: {
      title: "學術活動",
      read_more: "閱讀全文",
      back: "關閉"
    },
    footer: {
      rights: "版權所有",
      name: "AI 治理觀念實驗室",
      location: "中央研究院，台北"
    }
  },
  en: {
    site: {
      title: "AI Governance Laboratory - IEAS, Academia Sinica",
      name: "AI Governance Laboratory"
    },
    nav: {
      mission: "Mission",
      research: "Research",
      team: "Team",
      events: "Events",
    },
    hero: {
      label: "Academia Sinica IEAS",
      title_line1: "Governance for the",
      title_highlight: "AI Age",
      title_line2: "",
      desc: "Bridging the gap between rapid technological advancement and human values through interdisciplinary research.",
      scroll: "Scroll to Explore"
    },
    mission: {
      title: "Our Mission",
      main_quote: "Technology does not exist in a vacuum. It is shaped by, and shapes, society.",
      box1_title: "The Black Box",
      box1_desc: "Addressing challenges in transparency and explainability.",
      box2_title: "Local Context",
      box2_desc: "Contributing a Taiwanese perspective to global AI norms.",
      box3_title: "Dialogue",
      box3_desc: "Law x Philosophy x CS"
    },
    team: {
      title: "The Team",
      subtitle: "Experts from Law, Computer Science, and Social Sciences",
      join_title: "Join Us",
      join_desc: "We are looking for passionate researchers.",
      collaborators_title: "Collaborators",
      collaborators_desc: "View Partners"
    },
    activities: {
      title: "Activities & News",
      read_more: "Read More",
      back: "Close"
    },
    footer: {
      rights: "All rights reserved.",
      name: "AI Governance Laboratory",
      location: "Academia Sinica, Taipei"
    }
  }
};

export const MEMBERS = [
  {
    id: 1,
    name: "Chih-Hsing Ho (何之行)",
    name_en: "Chih-Hsing Ho",
    name_zh: "何之行",
    role_zh: "計畫主持人 / 副研究員",
    role_en: "Project Coordinator / Associate Research Fellow",
    image: "https://api.dicebear.com/7.x/initials/svg?seed=CH&backgroundColor=2563eb&textColor=ffffff",
    tags: ["Law", "Bioethics"]
  },
  {
    id: 2,
    name: "Cheng-Hung Tsai (蔡政宏)",
    name_en: "Cheng-Hung Tsai",
    name_zh: "蔡政宏",
    role_zh: "研究員",
    role_en: "Research Fellow",
    image: "https://api.dicebear.com/7.x/initials/svg?seed=CT&backgroundColor=1e293b&textColor=ffffff",
    tags: ["Philosophy", "Epistemology"]
  },
  {
    id: 3,
    name: "Tzu-Wei Hung (洪子偉)",
    name_en: "Tzu-Wei Hung",
    name_zh: "洪子偉",
    role_zh: "研究員",
    role_en: "Research Fellow",
    image: "https://api.dicebear.com/7.x/initials/svg?seed=TH&backgroundColor=1e293b&textColor=ffffff",
    tags: ["Cognitive Science", "Philosophy"]
  },
  {
    id: 4,
    name: "Hung-Ju Chen (陳弘儒)",
    name_en: "Hung-Ju Chen",
    name_zh: "陳弘儒",
    role_zh: "助研究員",
    role_en: "Assistant Research Fellow",
    image: "https://api.dicebear.com/7.x/initials/svg?seed=HC&backgroundColor=1e293b&textColor=ffffff",
    tags: ["Jurisprudence", "Democracy"]
  },
  {
    id: 5,
    name: "Jay Jian (簡士傑)",
    name_en: "Jay Jian",
    name_zh: "簡士傑",
    role_zh: "助研究員",
    role_en: "Assistant Research Fellow",
    image: "https://api.dicebear.com/7.x/initials/svg?seed=JJ&backgroundColor=1e293b&textColor=ffffff",
    tags: ["Law", "International Relations"]
  },
  {
    id: 6,
    name: "Bow-Yaw Wang (王柏堯)",
    name_en: "Bow-Yaw Wang",
    name_zh: "王柏堯",
    role_zh: "資訊所研究員",
    role_en: "Research Fellow, IIS",
    image: "https://api.dicebear.com/7.x/initials/svg?seed=BW&backgroundColor=1e293b&textColor=ffffff",
    tags: ["Computer Science", "Verification"]
  },
  {
    id: 7,
    name: "Tyng-Ruey Chuang (莊庭瑞)",
    name_en: "Tyng-Ruey Chuang",
    name_zh: "莊庭瑞",
    role_zh: "資訊所副研究員",
    role_en: "Associate Research Fellow, IIS",
    image: "https://api.dicebear.com/7.x/initials/svg?seed=TC&backgroundColor=1e293b&textColor=ffffff",
    tags: ["Information Science", "Open Source"]
  },
];

export const COLLABORATORS = [
  {
    id: 1,
    category_zh: "臺灣學術機構",
    category_en: "Academic Institutions in Taiwan",
    members: [
      {
        name: "Shao-Man Lee (李韶曼)",
        name_zh: "李韶曼",
        name_en: "Shao-Man Lee",
        role_zh: "國立成功大學敏求智慧運算學院助理教授",
        role_en: "Assistant Professor / NCKU Miin Wu School of Computing",
        url: "https://sites.google.com/view/shaomanlee"
      }
    ]
  },
  {
    id: 2,
    category_zh: "國際合作",
    category_en: "International Collaborative Partners",
    members: [
      {
        name: "Yann Joly",
        name_zh: "Yann Joly",
        name_en: "Yann Joly",
        role_zh: "James McGill Professor & Director of the Centre of Genomics and Policy (CGP), Faculty of Medicine and Health Sciences, McGill University, Canada",
        role_en: "James McGill Professor & Director of the Centre of Genomics and Policy (CGP), Faculty of Medicine and Health Sciences, McGill University, Canada",
        url: "https://genomic.medicine.mcgill.ca/investigator/yann-joly"
      },
      {
        name: "Frank Pasquale",
        name_zh: "Frank Pasquale",
        name_en: "Frank Pasquale",
        role_zh: "Professor, Cornell Law School, USA",
        role_en: "Professor, Cornell Law School, USA",
        url: "https://www.lawschool.cornell.edu/faculty-research/faculty-directory/frank-pasquale/"
      },
      {
        name: "Marcelo Corrales Compagnucci",
        name_zh: "Marcelo Corrales Compagnucci",
        name_en: "Marcelo Corrales Compagnucci",
        role_zh: "Associate Professor & Associate Director, Center for Advanced Studies in Biomedical Innovation Law (CeBIL), Faculty of Law, University of Copenhagen, Denmark",
        role_en: "Associate Professor & Associate Director, Center for Advanced Studies in Biomedical Innovation Law (CeBIL), Faculty of Law, University of Copenhagen, Denmark",
        url: "https://jura.ku.dk/english/staff/research/?pure=en%2Fpersons%2Fmarcelo-corrales-compagnucci(979af57e-b54d-455c-bb6e-8bece3619083).html"
      },
      {
        name: "Alan Toy",
        name_zh: "Alan Toy",
        name_en: "Alan Toy",
        role_zh: "Senior Lecturer, University of Auckland, New Zealand",
        role_en: "Senior Lecturer, University of Auckland, New Zealand",
        url: "https://profiles.auckland.ac.nz/alan-toy"
      },
      {
        name: "Calvin Ho",
        name_zh: "Calvin Ho",
        name_en: "Calvin Ho",
        role_zh: "Associate Professor, Faculty of Law, Monash University, Australia",
        role_en: "Associate Professor, Faculty of Law, Monash University, Australia",
        url: "https://research.monash.edu/en/persons/calvin-ho"
      },
      {
        name: "Yueh-Hsuan Weng (翁岳暄)",
        name_zh: "翁岳暄",
        name_en: "Yueh-Hsuan Weng",
        role_zh: "Associate Professor, Institute of Advanced Study (IAS), Kyushu University, Japan",
        role_en: "Associate Professor, Institute of Advanced Study (IAS), Kyushu University, Japan",
        url: "https://works.bepress.com/weng_yueh_hsuan/"
      }
    ]
  }
];

// Import events from individual event files
// To add a new event: Create a new .ts file in src/data/events/ using _template.ts
export { POSTS } from './events';