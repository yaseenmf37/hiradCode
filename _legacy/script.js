import { createProjectFromForm, deleteProject, loadProjects, saveProjects } from './data.js';

const renderHomeProjects = () => {
  const grid = document.querySelector('#portfolioGrid');
  if (!grid) return;

  const projects = loadProjects();
  grid.innerHTML = projects
    .map((project) => {
      const tags = project.tags.map((tag) => `<span>${tag}</span>`).join('');
      return `
        <article class="project-card">
          <div class="project-card__media" style="background-image: linear-gradient(135deg, ${project.accent}33, #0f0f15 90%), url('${project.image}')"></div>
          <div class="project-card__content">
            <p class="project-card__category">${project.category}</p>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tag-list">${tags}</div>
            <a class="project-card__link" href="${project.link}" target="_blank" rel="noreferrer">مشاهده پروژه</a>
          </div>
        </article>
      `;
    })
    .join('');
};

const renderAdminProjects = () => {
  const list = document.querySelector('#projectsList');
  if (!list) return;

  const projects = loadProjects();
  list.innerHTML = projects
    .map(
      (project) => `
        <article class="project-row">
          <div>
            <h3>${project.title}</h3>
            <p>${project.category}</p>
          </div>
          <button class="btn btn--ghost" data-delete="${project.id}" type="button">حذف</button>
        </article>
      `
    )
    .join('');
};

const handleAdminSubmit = (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = Object.fromEntries(new FormData(form));
  const project = createProjectFromForm(formData);
  const projects = [...loadProjects(), project];
  saveProjects(projects);
  form.reset();
  renderHomeProjects();
  renderAdminProjects();
};

const handleDelete = (event) => {
  const button = event.target.closest('[data-delete]');
  if (!button) return;
  const id = button.getAttribute('data-delete');
  const projects = deleteProject(loadProjects(), id);
  saveProjects(projects);
  renderHomeProjects();
  renderAdminProjects();
};

const init = () => {
  renderHomeProjects();
  renderAdminProjects();

  const form = document.querySelector('#projectForm');
  if (form) {
    form.addEventListener('submit', handleAdminSubmit);
  }

  document.addEventListener('click', handleDelete);
};

document.addEventListener('DOMContentLoaded', init);
