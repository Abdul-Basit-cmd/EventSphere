// Curated high-resolution Unsplash event photography for exhibition categories
export const EXPO_THEME_IMAGES = {
  tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  green: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
  fintech: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
  industry: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  creative: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
};

export const getExpoCoverImage = (expo, fallbackIndex = 0) => {
  if (expo?.coverImage && expo.coverImage.startsWith('http')) {
    return expo.coverImage;
  }
  const text = `${expo?.theme || ''} ${expo?.title || ''}`.toLowerCase();
  if (text.includes('tech') || text.includes('ai') || text.includes('software') || text.includes('cyber') || text.includes('cloud')) {
    return EXPO_THEME_IMAGES.tech;
  }
  if (text.includes('health') || text.includes('med') || text.includes('bio') || text.includes('pharma')) {
    return EXPO_THEME_IMAGES.health;
  }
  if (text.includes('green') || text.includes('energy') || text.includes('eco') || text.includes('agri') || text.includes('climate')) {
    return EXPO_THEME_IMAGES.green;
  }
  if (text.includes('fin') || text.includes('bank') || text.includes('commerce') || text.includes('retail') || text.includes('business')) {
    return EXPO_THEME_IMAGES.fintech;
  }
  if (text.includes('robot') || text.includes('auto') || text.includes('manufactur') || text.includes('industrial') || text.includes('hardware')) {
    return EXPO_THEME_IMAGES.industry;
  }
  if (text.includes('design') || text.includes('art') || text.includes('media') || text.includes('entertain')) {
    return EXPO_THEME_IMAGES.creative;
  }

  // Fallback variety if theme is generic
  const fallbackList = [
    EXPO_THEME_IMAGES.default,
    EXPO_THEME_IMAGES.tech,
    EXPO_THEME_IMAGES.fintech,
    EXPO_THEME_IMAGES.green,
    EXPO_THEME_IMAGES.industry,
  ];
  return fallbackList[fallbackIndex % fallbackList.length];
};
