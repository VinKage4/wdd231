const courses = [
  { code: 'CSE 110', name: 'Introduction to Programming', credits: 2, type: 'cse', completed: false },
  { code: 'CSE 111', name: 'Programming with Functions', credits: 2, type: 'cse', completed: false },
  { code: 'WDD 130', name: 'Web Fundamentals', credits: 2, type: 'wdd', completed: true },
  { code: 'CSE 210', name: 'Programming with Classes', credits: 2, type: 'cse', completed: false },
  { code: 'WDD 131', name: 'Dynamic Web Fundamentals', credits: 2, type: 'wdd', completed: true },
  { code: 'WDD 231', name: 'Frontend Web Development I', credits: 2, type: 'wdd', completed: false }
];

const grid = document.getElementById('courseGrid');
const totalEl = document.getElementById('creditTotal');
const filterBtns = document.querySelectorAll('.filters .btn');

function render(list){
  if (!grid) return;
  grid.innerHTML = '';
  list.forEach(c => {
    const row = document.createElement('div');
    row.className = 'course-item' + (c.completed ? ' completed' : '');
    row.innerHTML = `
      <span>${c.code} — ${c.name}</span>
      <span class="course-badges">
        <span class="badge">${c.type.toUpperCase()}</span>
        <span class="badge">${c.credits} cr</span>
        ${c.completed ? '<span class="badge success">Completed</span>' : ''}
      </span>
    `;
    grid.appendChild(row);
  });
  const credits = list.reduce((sum, c) => sum + c.credits, 0);
  if (totalEl) totalEl.textContent = credits;
}

function apply(kind){
  if (kind === 'wdd') return courses.filter(c => c.type === 'wdd');
  if (kind === 'cse') return courses.filter(c => c.type === 'cse');
  return courses.slice();
}

filterBtns.forEach(btn => btn.addEventListener('click', () => {
  const kind = btn.dataset.filter;
  render(apply(kind));
}));

// Initial render
render(courses);