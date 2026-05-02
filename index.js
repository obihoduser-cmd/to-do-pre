let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");


/*Функция loadTasks должна проверять, есть ли в локальном хранилище уже сохранённые задачи. 
Если они есть — возвращать их, в противном случае — возвращать список задач из массива items. 
Не забудьте, что при получении данных из локального хранилища необходимо преобразовать JSON-строку в JavaScript-объект с помощью метода JSON.parse..*/
function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    //список задач в виде массива
    return JSON.parse(savedTasks); 
  } else {
    //если пусто
    return items; 
  }
}

/*Функция createItem — отвечает за создание готовой разметки элемента задачи. 
Она должна принимать строку с текстом задачи в качестве параметра, устанавливать это значение в элемент .to-do__item-text с помощью свойства textContent и возвращать готовую разметку элемента задачи, 
хранящуюся в переменной, хранящийся в переменной clone, — копию, созданную на основе шаблона.*/
function createItem(item) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  //задаём текст задачи
  textElement.textContent = item;
  
  //УДАЛЕНИЕ
  deleteButton.addEventListener('click', function() {
    clone.remove();
    
    //обновляем список задач
    const items = getTasksFromDOM();
    saveTasks(items);
  });
  
  //КОПИРОВАНИЕ
  duplicateButton.addEventListener('click', function() {
    const itemName = textElement.textContent; //текст задачи
    const newItem = createItem(itemName); //новая задача с тем же текстом
    listElement.prepend(newItem);
    
    //обновляем список задач
    const items = getTasksFromDOM();
    saveTasks(items);
  });
  
  //РЕДАКТИРОВАНИЕ
  editButton.addEventListener('click', function() {
    textElement.setAttribute('contenteditable', 'true');
    textElement.focus();
  });
  
  //ЗАВЕРШЕНИЕ РЕДАКТИРОВАНИЯ
  textElement.addEventListener('blur', function() {
    textElement.setAttribute('contenteditable', 'false');
    
    //обновляем список задач
    const items = getTasksFromDOM();
    saveTasks(items);
  });
  return clone;
}


//Функция getTasksFromDOM должна собирать список задач из текущей разметки и возвращать его в виде массива строк
function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll('.to-do__item-text'); 
  const tasks = [];

  itemsNamesElements.forEach(element => {
    tasks.push(element.textContent); //текст каждой задачи в массив
  });
  
  return tasks;
}

/*Функция saveTasks должна сохранять в локальное хранилище переданный в параметре массив строк задач. 
Не забудьте, что перед сохранением массив необходимо преобразовать в строку с помощью метода JSON.stringify.*/
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


items = loadTasks();
//добавляем задачи из items в список
items.forEach(item => {
  const taskElement = createItem(item);
  listElement.append(taskElement);
});

//ФОРМА
formElement.addEventListener('submit', function(event) {
  event.preventDefault();
  const taskText = inputElement.value.trim();
  
  if (taskText) { //поле не пустое
    const taskElement = createItem(taskText);
    listElement.prepend(taskElement);
    
    //обновляем список задач
    items = getTasksFromDOM();
    saveTasks(items);
    
    inputElement.value = '';
  }
});
