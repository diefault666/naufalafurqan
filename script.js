// Render projects from data.js
function renderProjects() {
  const tbody = document.getElementById('projects-tbody');
  const projectCount = document.getElementById('projects-count');
  
  if (!tbody || typeof projectsData === 'undefined') return;

  tbody.innerHTML = '';
  
  if (projectCount) {
    projectCount.textContent = `${projectsData.length} items`;
  }

  projectsData.forEach(project => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="dir-name">📁 ${project.name}</td>
      <td class="dir-desc">${project.description}</td>
      <td class="dir-date">${project.year}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Call the render function before setting up observers
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealIO.observe(el));

  // active section tracking -> sidebar + tabs + status bar
  const sections = document.querySelectorAll('.pane-section');
  const fileLinks = document.querySelectorAll('.file-link');
  const tabs = document.querySelectorAll('.tab');
  const statusFile = document.getElementById('statusFile');
  const tabNames = {
    profile: 'profile.md', experience: 'work_history.json', projects: 'directory_listing',
    skills: 'skills.yaml', education: 'education.txt', contact: 'contact.sh'
  };

  const setActive = (id) => {
    fileLinks.forEach(l => l.classList.toggle('active', l.dataset.target === id));
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    if (statusFile && tabNames[id]) statusFile.textContent = tabNames[id];
  };

  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { root: document.getElementById('content'), threshold: 0.35 });
  sections.forEach(s => sectionIO.observe(s));

  tabs.forEach(t => t.addEventListener('click', () => {
    document.getElementById(t.dataset.tab).scrollIntoView({ behavior: 'smooth' });
  }));

  // mobile sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuBtn = document.getElementById('menuBtn');
  const closeSidebar = () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); menuBtn.setAttribute('aria-expanded','false'); };
  const openSidebar = () => { sidebar.classList.add('open'); overlay.classList.add('show'); menuBtn.setAttribute('aria-expanded','true'); };
  menuBtn.addEventListener('click', () => { sidebar.classList.contains('open') ? closeSidebar() : openSidebar(); });
  overlay.addEventListener('click', closeSidebar);
  fileLinks.forEach(l => l.addEventListener('click', () => { if (window.innerWidth <= 860) closeSidebar(); }));
});
