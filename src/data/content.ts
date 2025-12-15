// This file contains all the text content for the website.
// Edit this file to update text without touching the code.

export type Lang = 'zh' | 'en';

export const CONTENT = {
  zh: {
    nav: {
      mission: "核心使命",
      research: "研究領域",
      team: "研究團隊",
      events: "學術活動",
    },
    hero: {
      label: "中研院歐美研究所",
      title_line1: "治理",
      title_highlight: "機器時代",
      title_line2: "的未來",
      desc: "AI 治理觀念實驗室結合法律、哲學與資訊科學，探索人工智慧時代的倫理規範與社會衝擊。",
      scroll: "向下探索"
    },
    mission: {
      title: "核心使命",
      main_quote: "科技不存於真空。它被社會形塑，也形塑著社會。",
      box1_title: "黑箱問題",
      box1_desc: "解決演算法透明度與可解釋性的挑戰。",
      box2_title: "在地觀點",
      box2_desc: "以台灣繁體中文使用者的視角，參與全球 AI 規範制定。",
      box3_title: "跨域對話",
      box3_desc: "法律 x 哲學 x 資訊科學"
    },
    team: {
      title: "研究團隊",
      subtitle: "來自不同領域的頂尖學者",
      join_title: "加入我們",
      join_desc: "尋找對 AI 治理有熱誠的研究夥伴"
    },
    activities: {
      title: "學術活動",
      read_more: "閱讀全文",
      back: "關閉"
    },
    footer: {
      rights: "版權所有"
    }
  },
  en: {
    nav: {
      mission: "Mission",
      research: "Research",
      team: "Team",
      events: "Events",
    },
    hero: {
      label: "Academia Sinica IEAS",
      title_line1: "Governance for the",
      title_highlight: "Machine Age",
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
      join_desc: "We are looking for passionate researchers."
    },
    activities: {
      title: "Activities & News",
      read_more: "Read More",
      back: "Close"
    },
    footer: {
      rights: "All rights reserved."
    }
  }
};

export const MEMBERS = [
  { 
    id: 1,
    name: "Chih-Hsing Ho (何之行)", 
    role_zh: "計畫主持人 / 副研究員", 
    role_en: "Project Coordinator / Associate Research Fellow", 
    image: "https://api.dicebear.com/7.x/initials/svg?seed=CH&backgroundColor=2563eb&textColor=ffffff",
    tags: ["Law", "Bioethics"] 
  },
  { 
    id: 2,
    name: "Cheng-Hung Tsai (蔡政宏)", 
    role_zh: "研究員", 
    role_en: "Research Fellow", 
    image: "https://api.dicebear.com/7.x/initials/svg?seed=CT&backgroundColor=1e293b&textColor=ffffff",
    tags: ["Philosophy", "Epistemology"] 
  },
  { 
    id: 3,
    name: "Tzu-Wei Hung (洪子偉)", 
    role_zh: "研究員", 
    role_en: "Research Fellow", 
    image: "https://api.dicebear.com/7.x/initials/svg?seed=TH&backgroundColor=1e293b&textColor=ffffff",
    tags: ["Cognitive Science", "Philosophy"] 
  },
  { 
    id: 4,
    name: "Hung-Ju Chen (陳弘儒)", 
    role_zh: "助研究員", 
    role_en: "Assistant Research Fellow", 
    image: "https://api.dicebear.com/7.x/initials/svg?seed=HC&backgroundColor=1e293b&textColor=ffffff",
    tags: ["Jurisprudence", "Democracy"] 
  },
];

export const POSTS = [
  {
    id: "lecture-2025-12-09",
    date: "2025-12-09",
    year: "2025",
    type: "Lecture",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
    title_zh: "邀請新加坡國立大學陳維曾教授演講",
    title_en: "Guest Lecture by Prof. Weitseng Chen (NUS)",
    content_zh: "講題：「美國的法治援助如何強化威權？台灣、南韓與中國的比較」。由何之行副研究員主持。探討法治推廣在特定政治脈絡下可能產生的非預期後果。",
    content_en: "Topic: 'When Rule of Law Promotion Builds Authoritarianism'. Hosted by Dr. Chih-hsing Ho. Exploring the unintended consequences of rule of law promotion."
  },
  {
    id: "lecture-2025-10-08",
    date: "2025-10-08",
    year: "2025",
    type: "Lecture",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    title_zh: "智慧醫療中的 AI：平衡創新、倫理與法律",
    title_en: "AI in Smart Healthcare: Balancing Innovation, Ethics and Law",
    content_zh: "邀請丹麥哥本哈根法學院 Marcelo Corrales Compagnucci 博士演講。智慧醫療技術的進步帶來了巨大的機遇，但也引發了關於隱私、數據安全和患者權利的複雜問題。",
    content_en: "Speaker: Dr. Marcelo Corrales Compagnucci (University of Copenhagen). Discussing the balance between innovation, ethics, and law in smart healthcare."
  },
  {
    id: "conf-2025-07-03",
    date: "2025-07-03",
    year: "2025",
    type: "Conference",
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
    title_zh: "中研學術大會：AI 時代下的批判性思維",
    title_en: "AS Conference: Critical Thinking in the AI Era",
    content_zh: "本場次包含三場專題演講：\n1. 蔡政宏研究員：人工理性批判\n2. 陳弘儒助研究員：人工智慧與民主意涵\n3. 何之行副研究員：AI治理的邊界與難題",
    content_en: "Featuring keynotes on Artificial Reason, Democratic Values in AI, and Boundaries of AI Governance."
  }
];