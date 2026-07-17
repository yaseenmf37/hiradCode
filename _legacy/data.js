export const DEFAULT_PROJECTS = [
  {
    id: 'project-1',
    title: 'Nova Studio',
    category: 'Branding • UI/UX',
    description: 'یک تجربه برندینگ و وب‌سایت مدرن برای استودیوی خلاقانه با روایت بصری قوی.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    link: '#',
    accent: '#ff3da0',
    tags: ['Branding', 'UI/UX', 'Creative']
  },
  {
    id: 'project-2',
    title: 'Astra Commerce',
    category: 'E-commerce • Frontend',
    description: 'یک فروشگاه آنلاین شیک و سریع با تمرکز روی تبدیل کاربر و تجربه خرید روان.',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
    link: '#',
    accent: '#8b5cf6',
    tags: ['E-commerce', 'React', 'Conversion']
  },
  {
    id: 'project-3',
    title: 'Luma SaaS',
    category: 'SaaS • Product Design',
    description: 'سایت محصولی با ظاهر مدرن برای یک پلتفرم دیجیتال با هویت بصری قدرتمند.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    link: '#',
    accent: '#ff71bb',
    tags: ['SaaS', 'Product', 'Design']
  }
];

function storageAvailable() {
  return typeof window !== 'undefined' && window.localStorage;
}

export function loadProjects() {
  if (!storageAvailable()) {
    return structuredClone(DEFAULT_PROJECTS);
  }

  try {
    const saved = window.localStorage.getItem('hiradPortfolioProjects');
    if (!saved) return structuredClone(DEFAULT_PROJECTS);
    return JSON.parse(saved);
  } catch {
    return structuredClone(DEFAULT_PROJECTS);
  }
}

export function saveProjects(projects) {
  if (!storageAvailable()) return projects;

  window.localStorage.setItem('hiradPortfolioProjects', JSON.stringify(projects));
  return projects;
}

export function createProjectFromForm(formData) {
  const tags = formData.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const title = formData.title.trim();
  const description = formData.description.trim();

  return {
    id: globalThis.crypto?.randomUUID?.() || `project-${Date.now()}`,
    title: title || 'پروژه جدید',
    category: formData.category.trim() || 'Web Design',
    description: description || 'توضیح پروژه را وارد کنید.',
    image: formData.image.trim() || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
    link: formData.link.trim() || '#',
    accent: '#ff3da0',
    tags
  };
}

export function deleteProject(projects, id) {
  return projects.filter((project) => project.id !== id);
}
