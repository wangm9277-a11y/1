export const INITIAL_LIVES = 3;
export const POINTS_PER_QUESTION = 100;

export const THEME_COLORS = {
  bg: 'bg-[#C2B280]', // Sand/Paper color
  primary: 'bg-[#8B4513]', // Saddle Brown
  accent: 'bg-[#A0522D]', // Sienna
  success: 'bg-[#556B2F]', // Dark Olive Green
  danger: 'bg-[#800000]', // Maroon
  text: 'text-[#2F2F2F]', // Dark Charcoal
  white: 'text-[#F5F5F5]'
};

export const MOCK_FALLBACK_CASE = {
  patientName: "张三",
  appearance: {
    face: "面色淡白无华",
    tongue: "舌淡苔白",
    pulse: "脉细弱"
  },
  complaint: "大夫，我最近总是感觉头晕眼花，心慌心悸，干一点活就累得不行，脸色也难看。",
  correctDiagnosis: "气血亏虚证",
  wrongOptions: ["肝阳上亢证", "痰湿中阻证", "肾阳虚衰证"],
  explanation: "患者面色淡白、舌淡脉细弱均为血虚之象；气短乏力、动则加剧为气虚之象。气血双亏，故见头晕眼花、心悸等。"
};
