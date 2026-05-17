export type Role = 'user' | 'assistant' | 'system';

export interface Message {
    id: string;
    role: Role;
    content: string;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
}
