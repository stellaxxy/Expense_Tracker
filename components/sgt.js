class SGT_template{
    /* constructor - sets up sgt object
    params: (object) elementConfig - all pre-made dom elements used by the app.  See script.js for a list of elements coming in via the object
    purpose: instantiates a model and stores it in the object
    return: undefined
    */
    constructor( object ){
        this.model = new Model();
        this.elementConfig = object;

        this.handleCancel = this.handleCancel.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.displayAllStudents = this.displayAllStudents.bind(this);

        this.model.handleGetData( this.displayAllStudents );
    }
    /* addEventHandlers - add event handlers to premade dom elements
    adds click handlers to add and cancel buttons using the dom elements passed into constructor
    params: none
    return: undefined
    */

    addEventHandlers(){

        this.elementConfig.addButton.click(this.handleAdd);
        this.elementConfig.cancelButton.click(this.handleCancel);
    }
    /* clearInputs - take the three inputs and clear their values
    params: none
    return: undefined
    */
    clearInputs(){
        this.elementConfig.nameInput.val('');
        this.elementConfig.courseInput.val('');
        this.elementConfig.gradeInput.val('');
    }
    /* handleCancel - function to handle the cancel button press
    params: none
    return: undefined
    */
    handleCancel(){
        this.elementConfig.nameInput.val('');
        this.elementConfig.courseInput.val('');
        this.elementConfig.gradeInput.val('');
    }
    /* handleAdd - function to handle the add button click
    purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
    params: none
    return: undefined
    */
    handleAdd(){

        var name = this.elementConfig.nameInput.val();
        var course = this.elementConfig.courseInput.val();
        var grade = this.elementConfig.gradeInput.val();
        var id = null;
        $('.errorMessage').show();
        $.ajax({
            //url: 'http://s-apis.learningfuze.com/sgt/create',
            url: 'http://localhost/SGT/server/createstudent.php',
            method: 'POST',
            data: {api_key: 'iRGOfKr2Z2', name: name, course: course, grade: grade},
            dataType: 'json',
            success: (function(response){

                $('.errorMessage').hide();
                if(response.errors){
                    $('.loadingButton').hide();
                    $('.errorText').text(response.errors);
                    $('.errorMessage').show();
                }
                id = response.new_id;
                this.model.add(name, course, grade, id);
                this.clearInputs();
                this.displayAllStudents();

            }).bind(this)
        });

    }
    /* displayAllStudents - iterate through all students in the model
    purpose:
        grab all students from model,
        iterate through the retrieved list,
        then render every student's dom element
        then append every student to the dom's display area
        then display the grade average
    params: none
    return: undefined
    */
    displayAllStudents(){
        this.elementConfig.displayArea.empty();
        var allStudents = this.model.dataArray;
        for(var index = 0; index < allStudents.length; index++){
            var studentRow = allStudents[index].render();
            this.elementConfig.displayArea.append(studentRow);
        }
        this.displayAverage();
    }
    /* displayAverage - get the grade average and display it
    purpose: grab the average grade from the model, and show it on the dom
    params: none
    return: undefined */
    displayAverage(){
        var averageGrade = this.model.calculateGradeAverage();
        this.elementConfig.averageArea.text(averageGrade);
    }
}