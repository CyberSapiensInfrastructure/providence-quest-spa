export const QUESTS = {
  TWITTER_FOLLOW: {
    id: 'twitter_follow',
    title: 'Follow on Twitter',
    url: 'https://twitter.com/Providence_Tr',
    type: 'twitter_follow',
    status: 'pending' as 'pending' | 'completed' | 'failed'
  },
  TWITTER_LIKE: {
    id: 'twitter_like',
    title: 'Like the Tweet',
    tweetUrl: 'https://twitter.com/Providence_Tr/status/1858888925281976397',
    tweetId: '1858888925281976397',
    type: 'twitter_like',
    status: 'pending' as 'pending' | 'completed' | 'failed'
  },
  TELEGRAM: {
    id: 'telegram_join',
    title: 'Join Telegram',
    url: 'https://t.me/PlayProvidence',
    type: 'telegram',
    status: 'pending' as 'pending' | 'completed' | 'failed'
  }
};

export type QuestType = keyof typeof QUESTS;
export type QuestStatus = 'pending' | 'completed' | 'failed'; 