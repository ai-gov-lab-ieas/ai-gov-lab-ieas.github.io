import { Event } from './types';

export const event: Event = {
  id: "lecture-2025-06-20",
  date: "2025-06-20",
  year: "2025",
  type: "Lecture",
  image: "/images/events/2025/lecture-2025-06-20.jpg",
  title_zh: "Questioning Truths, Sharpening Minds: Leveraging Human Questions and LLM-in-the-Loop to Boost News Literacy",
  title_en: "Questioning Truths, Sharpening Minds: Leveraging Human Questions and LLM-in-the-Loop to Boost News Literacy",
  content_zh: `講題：「Questioning Truths, Sharpening Minds: Leveraging Human Questions and LLM-in-the-Loop to Boost News Literacy」

講者：中央研究院資訊科學研究所古倫維研究員

主持人：何之行副研究員

大綱：Fake news is not just a technological problem—it’s a cognitive challenge. This talk presents an interactive system that leverages human inquiry to iteratively enhance explanations provided by a large language model for questionable news stories. By treating explanation generation as a dialogue, the system encourages users to ask clarifying questions, raise objections, and offer comments, prompting the AI to refine its responses in real time. With each round of Q&A, the explanations become increasingly complete, transparent, and tailored to users’ concerns. Our findings reveal that this question-driven process significantly shapes explanations. Thoughtful questions can help uncover the truth behind false claims—highlighting inconsistencies and providing enlightening context to debunk misinformation. Although the AI’s responses, influenced by its underlying knowledge and reasoning abilities, could potentially lead to misunderstandings, the overall risk of harm remains minor. Ultimately, the interactive questioning process significantly enhances the persuasiveness and clarity of generated explanations. Looking forward, we envision the system becoming a hands-on educational tool. In classroom settings, it can serve as a debate partner, presenting controversial news claims and engaging students in lively Q&A exchanges. The system actively prompts students to challenge AI statements, demand evidence, and identify logical fallacies, fostering essential news literacy skills. For students unfamiliar with debate practices, the AI can also demonstrate an automated argumentative process, serving as a helpful teaching assistant. This playful yet informative format transforms passive news consumption into active critical investigation, making lessons about misinformation both enjoyable and impactful.

時間：2025年6月20日（星期五）上午10:30

地點：中研院歐美所一樓會議室`,
  content_en: `Topic: "Questioning Truths, Sharpening Minds: Leveraging Human Questions and LLM-in-the-Loop to Boost News Literacy"

Speaker: Dr. Lun-wei Ku, Research Fellow, Institute of Information Science, Academia Sinica

Moderator: Dr. Chih-hsing Ho (Associate Research Fellow, Institute of European and American Studies, Academia Sinica)

Abstract: Fake news is not just a technological problem—it’s a cognitive challenge. This talk presents an interactive system that leverages human inquiry to iteratively enhance explanations provided by a large language model for questionable news stories. By treating explanation generation as a dialogue, the system encourages users to ask clarifying questions, raise objections, and offer comments, prompting the AI to refine its responses in real time. With each round of Q&A, the explanations become increasingly complete, transparent, and tailored to users’ concerns. Our findings reveal that this question-driven process significantly shapes explanations. Thoughtful questions can help uncover the truth behind false claims—highlighting inconsistencies and providing enlightening context to debunk misinformation. Although the AI’s responses, influenced by its underlying knowledge and reasoning abilities, could potentially lead to misunderstandings, the overall risk of harm remains minor. Ultimately, the interactive questioning process significantly enhances the persuasiveness and clarity of generated explanations. Looking forward, we envision the system becoming a hands-on educational tool. In classroom settings, it can serve as a debate partner, presenting controversial news claims and engaging students in lively Q&A exchanges. The system actively prompts students to challenge AI statements, demand evidence, and identify logical fallacies, fostering essential news literacy skills. For students unfamiliar with debate practices, the AI can also demonstrate an automated argumentative process, serving as a helpful teaching assistant. This playful yet informative format transforms passive news consumption into active critical investigation, making lessons about misinformation both enjoyable and impactful.

Date & Time: Friday, June 20, 2025, 10:30 AM

Venue: 1st Floor Conference Room, Institute of European and American Studies, Academia Sinica`,

  speakers: [
    { name_zh: "古倫維", name_en: "Lun-wei Ku", affiliation_zh: "中央研究院資訊科學研究所", affiliation_en: "Institute of Information Science, Academia Sinica" },
    { member: "chih-hsing-ho" },
  ],
};

export default event;
