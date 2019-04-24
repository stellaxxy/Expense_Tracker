class Model{
    /* constructor - set up properties and binds for the model object
    params: none
    return: undefined (don't return undefined, that will screw it up)
    notes: store your records in an array that is a property of this object
    */
    constructor(){
        this.dataArray = [];
        this.id = 0;
        this.remove = this.remove.bind(this);
        this.handleGetData = this.handleGetData.bind(this);

    }
    /* getNextID - for version .1-.5, returns the next available ID
    purpose: takes an id property from the constructor, adds one, and returns it
    params: none
    return: (number) the next id
    */
    getNextID(){
        this.id += 1;

        return this.id;
    }
    /* add - add a student to the model
    purpose:
        take in a name, course, and grade,
        generate an ID (this will be given later by the server, too)
        create new student record with id, name, course, grade, and a reference to the model's remove method
        add the newly made student to the model's list of students
    params:
        (string) name: the student's name
        (string) course: the student's course
        (number) grade: the student's grade
    return: (number) the current number of students in the list
    */
    add(name, course, grade, id){
        //var id = this.getNextID();
        var studentObject = new StudentRecord(id, name, course, grade, this.remove);
        this.dataArray.push(studentObject);

        return this.dataArray.length;

    }
    /* remove - called from the student object when the student is removing itself, so the model can also remove it from the list
    purpose - finds the given student in the model's list, and removes it
    params: (StudentRecord object) the student to remove
    return: (boolean) true if the student was removed, false if not
    */
    remove(student){
        var indexToDelete = null;
        for(var index = 0; index < this.dataArray.length; index++){
            if(this.dataArray[index] === student){
                indexToDelete = index;
                break;
            }
        }
        if(indexToDelete === null){
            return false;
        }
        $('.errorMessage').show();
        this.dataArray.splice(indexToDelete, 1);
        $.ajax({
            //url: 'http://s-apis.learningfuze.com/sgt/delete',
            url: 'http://localhost/SGT/server/deletestudents.php',
            method: 'POST',
            data: {api_key: 'iRGOfKr2Z2', student_id: student.data.id},
            dataType: 'json',
            success: function(response){
                $('.errorMessage').hide();
                if(response.errors){
                    $('.loadingButton').hide();
                    $('.errorText').text(response.errors);
                    $('.errorMessage').show();
                    return false;
                }
            }
        });
        return true;
    }
    /* getAllStudents - get the entire list of students and return it
    params: none
    return: (array) a list of all the student objects
    */
    getAllStudents(){
        return this.dataArray;
    }
    /* getStudentByField - find a particular student by an arbitrary field, for example find the student with a name of "John Smith"
    purpose:
        take in a field and value,
        iterate through the student list
        search for the object with the field by the value
        return that student if found, -1 if not
    params:
        (string) field - the property of the student to look through (for example, name, or course, or grade)
        (multiple) value - the value to search for, for example 'Jack' or 5
    return: (StudentRecord) student if found, (Number) -1 if not found
    */
    getStudentByField( field, value ){

        for(var index = 0; index < this.dataArray.length; index++){
            if(this.dataArray[index].data[field] === value){
                return this.dataArray[index];
            }
        }
        return -1;
    }
    /* calculateGradeAverage - calculate the average grade of all students
    purpose:
        iterate through all students
        sum up their grades
        divide by the number of grades to get the average and return it
        Will return 0 if there are no students
    params: none
    return: (number) the average grade of all students
    */
    calculateGradeAverage(){
        var totalGrade = 0;
        for(var index = 0; index < this.dataArray.length; index++){
            totalGrade += this.dataArray[index].data.grade;
        }
        var averageGrade = totalGrade / this.dataArray.length;
        if(this.dataArray.length === 0){
            return 0;
        } else {
            return averageGrade;
        }
    }

    addGetDataHandler(){
        $('#getDataButton').click(this.handleGetData);
    }

    handleGetData (callThisFunctionAfterWeGetData){
        //var self = this;
        $.ajax({
            //url: 'http://s-apis.learningfuze.com/sgt/get',
            url: 'http://localhost/SGT/server/getstudents.php',
            method: 'POST',
            data: {api_key: 'iRGOfKr2Z2'},
            dataType: 'json',
            success: (function (response) {

                for (var index = 0; index < response.data.length; index++) {
                    var name = response.data[index].name;
                    var grade = response.data[index].grade;
                    var course = response.data[index].course;
                    var id = response.data[index].id;


                    this.add(name, course, grade, id); //self.add()
                }

                callThisFunctionAfterWeGetData()

            }).bind(this) //: is like =, when the computer read the lines and construct the object it will take care the right side first before the left side of the colon;
            // so when it reads .bind(this) the object hasn't finished constructing yet so it is not a object yet, 'this' still reference to the model object.
        })//.then( someFunction )
    }
}