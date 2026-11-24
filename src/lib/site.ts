import profile from '../../content/profile.json';
import projects from '../../content/projects.json';

export { profile, projects };
export function path(part = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + '/' + part.replace(/^\/+/, '');
}
export const resume = path(profile.resume_file.replace(/^public\//, ''));
export const nav = [
  ['Home', ''], ['Projects', 'projects/'], ['Research', 'research/'],
  ['Experience', 'experience/'], ['Contact', 'contact/'],
];
export const projectPage = (slug: string) => path('projects/' + slug + '/');
