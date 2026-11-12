/* Academic Planner: add, complete and delete tasks.
   Tasks are kept in an array and saved to localStorage. */
(function () {
  "use strict";

  var STORAGE_KEY = "cos106-planner-tasks";
  var tasks = [];
  var currentFilter = "all";

  var form = document.getElementById("task-form");
  var titleInput = document.getElementById("task-title");
  var courseSelect = document.getElementById("task-course");
  var prioritySelect = document.getElementById("task-priority");
  var errorEl = document.getElementById("task-error");
  var listEl = document.getElementById("task-list");
  var emptyEl = document.getElementById("empty");
  var filterButtons = document.querySelectorAll(".filters button");
  var clearBtn = document.getElementById("clear-done");

  // ---------- Storage ----------
  function loadTasks() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) return saved;
    } catch (e) { /* storage unavailable or corrupted */ }
    return [
      { id: 1, title: "Finish COS 106 term project", course: "COS 106", priority: "high", done: false },
      { id: 2, title: "Host site and submit GitHub link", course: "COS 106", priority: "medium", done: false },
      { id: 3, title: "Read lecture notes", course: "Other", priority: "low", done: true }
    ];
  }

  function saveTasks() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) { /* ignore */ }
  }

  // ---------- Operations ----------
  function addTask(title, course, priority) {
    tasks.push({ id: Date.now(), title: title, course: course, priority: priority, done: false });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    tasks.forEach(function (t) { if (t.id === id) t.done = !t.done; });
    saveTasks();
    render();
  }

  function deleteTask(id, li) {
    function remove() {
      tasks = tasks.filter(function (t) { return t.id !== id; });
      saveTasks();
      render();
    }
    if (li) {
      li.classList.add("removing");
      setTimeout(remove, 280);
    } else {
      remove();
    }
  }

  function visibleTasks() {
    return tasks.filter(function (t) {
      if (currentFilter === "active") return !t.done;
      if (currentFilter === "done") return t.done;
      return true;
    });
  }

  // ---------- Rendering ----------
  function render() {
    listEl.innerHTML = "";
    var shown = visibleTasks();

    shown.forEach(function (t) {
      var li = document.createElement("li");
      if (t.done) li.classList.add("done");

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = t.done;
      cb.setAttribute("aria-label", "Mark \"" + t.title + "\" as completed");
      cb.addEventListener("change", function () { toggleTask(t.id); });

      var text = document.createElement("div");
      text.className = "task-text";
      var strong = document.createElement("strong");
      strong.textContent = t.title;
      var small = document.createElement("small");
      small.textContent = t.course;
      text.appendChild(strong);
      text.appendChild(small);

      var badge = document.createElement("span");
      badge.className = "badge " + t.priority;
      badge.textContent = t.priority;

      var del = document.createElement("button");
      del.type = "button";
      del.className = "icon-btn";
      del.innerHTML = "&times;";
      del.setAttribute("aria-label", "Delete \"" + t.title + "\"");
      del.addEventListener("click", function () { deleteTask(t.id, li); });

      li.appendChild(cb);
      li.appendChild(text);
      li.appendChild(badge);
      li.appendChild(del);
      listEl.appendChild(li);
    });

    emptyEl.hidden = shown.length > 0;
    updateSummary();
  }

  function updateSummary() {
    var total = tasks.length;
    var done = tasks.filter(function (t) { return t.done; }).length;
    var pct = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById("count-total").textContent = total;
    document.getElementById("count-active").textContent = total - done;
    document.getElementById("count-done").textContent = done;
    document.getElementById("progress-text").textContent = pct + "%";
    document.getElementById("progress-bar").style.width = pct + "%";
  }

  // ---------- Events ----------
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var title = titleInput.value.trim();
    if (title === "") {
      errorEl.textContent = "Please enter a task before adding.";
      titleInput.classList.add("invalid");
      titleInput.focus();
      return;
    }
    errorEl.textContent = "";
    titleInput.classList.remove("invalid");
    addTask(title, courseSelect.value, prioritySelect.value);
    form.reset();
    titleInput.focus();
  });

  titleInput.addEventListener("input", function () {
    if (titleInput.value.trim() !== "") {
      errorEl.textContent = "";
      titleInput.classList.remove("invalid");
    }
  });

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentFilter = btn.dataset.filter;
      filterButtons.forEach(function (b) { b.classList.toggle("on", b === btn); });
      render();
    });
  });

  clearBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (t) { return !t.done; });
    saveTasks();
    render();
  });

  // ---------- Init ----------
  tasks = loadTasks();
  render();
})();
