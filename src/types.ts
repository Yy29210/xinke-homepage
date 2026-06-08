export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  simpleExpl: string; // 复杂问题讲成人话的解释
  tags: string[];
  roleInProject: string;
  portfolioUrl?: string;
}

export interface SkillItem {
  name: string;
  category: "core" | "interest" | "other";
  description: string;
}
