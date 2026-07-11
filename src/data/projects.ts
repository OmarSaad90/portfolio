export interface Project {
  id: string
  name: string
  domain: string
  url: string
  category: string
  description: string
  tech: string[]
  status: 'live' | 'coming-soon'
  image: string
}

export const projects: Project[] = [
  {
    id: 'ppa-consulting',
    name: 'PPA Consulting',
    domain: 'ppaconsulting.ca',
    url: 'https://ppaconsulting.ca',
    category: 'Construction consulting',
    description:
      'Custom website for a Canadian construction delay claims consulting firm. Built from scratch with HTML, CSS, and JS — fully branded, SEO optimized, deployed with a custom domain.',
    tech: ['HTML', 'CSS', 'JS', 'SEO'],
    status: 'live',
    image: '/projects/ppa-consulting.jpg',
  },
  {
    id: 'rockwood-civil',
    name: 'Rockwood Civil Solutions',
    domain: 'rcsest.ca',
    url: 'https://rcsest.ca',
    category: 'Heavy civil construction',
    description:
      'Website for a Canadian heavy civil construction firm. Built with React, Vite, and TypeScript. Contact form integration, deployed on Netlify with custom DNS configuration.',
    tech: ['React', 'TypeScript', 'Vite', 'Netlify'],
    status: 'live',
    image: '/projects/rockwood-civil.jpg',
  },
  {
    id: 'tilux',
    name: 'Tilux',
    domain: 'tilux.ca',
    url: 'https://tilux.ca',
    category: 'Renovation',
    description:
      'Official website for a Canadian renovation company. Modern, responsive design focused on showcasing services, project quality, and driving customer engagement.',
    tech: ['React', 'CSS', 'Responsive'],
    status: 'live',
    image: '/projects/tilux.jpg',
  },
  {
    id: 'ppa-peng-academy',
    name: 'PPA P.Eng. Academy',
    domain: 'ppapeng.ca',
    url: 'https://ppapeng.ca',
    category: 'Education platform',
    description:
      'Web platform for engineers preparing for Professional Engineer certification across Canada. Features a real-time live chat system, course listings, and an admin dashboard.',
    tech: ['React', 'TypeScript', 'Supabase', 'Netlify'],
    status: 'live',
    image: '/projects/ppa-peng-academy.jpg',
  },
  {
    id: 'aedifica',
    name: 'Aedifica',
    domain: 'edfca.com',
    url: 'https://edfca.com',
    category: 'Workforce development',
    description:
      'Platform for a workforce development initiative creating construction management career pathways across New Jersey. A complex multi-stakeholder vision turned into a clear digital experience for institutions, employers, and prospective participants.',
    tech: ['Next.js', 'TypeScript', 'React'],
    status: 'coming-soon',
    image: '/projects/aedifica.jpg',
  },
  {
    id: 'travo',
    name: 'Travo',
    domain: 'travo.co',
    url: 'https://travo.co',
    category: 'Advisory practice',
    description:
      'Specialty advisory practice quantifying cost, schedule, and commercial risk for complex capital projects — serving owners, public agencies, contractors, sureties, and lenders.',
    tech: ['Next.js', 'TypeScript', 'CSS'],
    status: 'live',
    image: '/projects/travo.jpg',
  },
]
