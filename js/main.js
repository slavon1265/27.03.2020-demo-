import DataBase from './db.js';
const $studentList = $('#students-list');
const $updateStudent = $('#update-student');
const $deleteStudent = $('#delete-student');

const db = new DataBase('https://frontend-lectures.firebaseio.com', 1);
db.getStudents().then(response => {
    console.log(response);

    //console.log(Object.entries(response))

    const students = Object.entries(response).map(item => {
        let [key, value] = item;
        //console.log('value:', value);
        value.id = key;
        return value;
    });

    //console.log('students', students)

    students.forEach(student => {
        $('<a>').text(student.firstname + 's ' + student.lastname)
            .addClass('list-group-item')
            .attr({
                'data-id': student.id,
                'href' : ''
                })
            .appendTo($studentList);
    })
});

$studentList.on('click', '[data-id]', function(event) {
    event.preventDefault();

    const studentId = $(this).data('id');

    db.getStudent(studentId).then(response => {
        for(let key in response){
            $updateStudent.find(`[name="${key}"]`).val(response[key]);
        }
        $updateStudent.find('[name="id"]').val(studentId);
    })
})

$updateStudent.on('submit', function(event){
    event.preventDefault();

   // console.log($(this).serialize()) - serialize прекрасен, нужно разобраться почему!
   //console.log(this.elements) //elements - показывает элементы формы

   const elements = Array.from(this.elements);
   const data = {};
   elements.forEach(item => {
       const name = $(item).attr('name');
       if (!name) return;

       const value = $(item).val();

       data[name] = value;
       
   });
   console.log(data)
   db.updateStudent(data.id, data).then(response);
        console.log('response', response);

        $studentList
            .find(`[data-id="${data.id}"]`)
                .text(`${response.firstname} ${response.lastname}`)

})

//console.log(db);