class SGT_template{
    /* constructor - sets up sgt object
    params: (object) elementConfig - all pre-made dom elements used by the app.  See script.js for a list of elements coming in via the object
    purpose: instantiates a model and stores it in the object
    return: undefined
    */
    constructor( object ){
        this.displayAllExpenses = this.displayAllExpenses.bind(this);
        this.model = new Model(this.displayAllExpenses);
        this.elementConfig = object;
        this.handleCancel = this.handleCancel.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.model.handleGetData( this.displayAllExpenses );
    }
    /* addEventHandlers - add event handlers to premade dom elements
    adds click handlers to add and cancel buttons using the dom elements passed into constructor
    params: none
    return: undefined
    */

    addEventHandlers(){
        this.elementConfig.addButton.click(this.handleAdd);
        this.elementConfig.cancelButton.click(this.handleCancel);
        this.elementConfig.deleteButton.click(this.model.handleDelete);
        this.elementConfig.updateButton.click(this.model.handleUpdateClick);
        this.elementConfig.updateCancelButton.click(this.model.handleCancelClick);
        this.elementConfig.updateConfirmButton.click(this.model.handleUpdateConfirmClick);
        this.elementConfig.searchType.click(this.model.handleTypeSearchClick);
        this.elementConfig.searchAll.click(this.model.handleSearchAllClick);

    }
    /* clearInputs - take the three inputs and clear their values
    params: none
    return: undefined
    */
    clearInputs(){
        this.elementConfig.typeInput.val('');
        this.elementConfig.dateInput.val('');
        this.elementConfig.vendorInput.val('');
        this.elementConfig.cityInput.val('');
        this.elementConfig.stateInput.val('');
        this.elementConfig.amountInput.val('');
        this.elementConfig.currencyInput.val('USD');
        this.elementConfig.paymentMethodInput.val('');
        this.elementConfig.commentInput.val('');
    }
    /* handleCancel - function to handle the cancel button press
    params: none
    return: undefined
    */
    handleCancel(){
        this.elementConfig.typeInput.val('');
        this.elementConfig.dateInput.val('');
        this.elementConfig.vendorInput.val('');
        this.elementConfig.cityInput.val('');
        this.elementConfig.stateInput.val('');
        this.elementConfig.amountInput.val('');
        this.elementConfig.currencyInput.val('USD');
        this.elementConfig.paymentMethodInput.val('');
        this.elementConfig.commentInput.val('');
    }
    /* handleAdd - function to handle the add button click
    purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
    params: none
    return: undefined
    */
    handleAdd(){
        let type = this.elementConfig.typeInput.val();
        const date = this.elementConfig.dateInput.val();
        let vendor = this.elementConfig.vendorInput.val();

        let city = this.elementConfig.cityInput.val();

        const state = this.elementConfig.stateInput.val();
        let amount = this.elementConfig.amountInput.val();

        const currency = this.elementConfig.currencyInput.val();
        const paymentMethod = this.elementConfig.paymentMethodInput.val();
        const comment = this.elementConfig.commentInput.val();
        var id = null;

        const transformedObj = this.model.handleTransformCases(type, city, vendor);
        type = transformedObj.type;
        city = transformedObj.city;
        vendor = transformedObj.vendor;

        $('.errorMessage').show();
        $.ajax({
            url: 'http://localhost/expense_tracker/server/createExpense.php',
            method: 'POST',
            data: {type, date, vendor, city, state, amount, currency, paymentMethod, comment},
            dataType: 'json',
            success: (function(response){

                $('.errorMessage').hide();
                if(response.errors){
                    $('.loadingButton').hide();
                    $('.errorText').text(response.errors);
                    $('.errorMessage').show();
                }
                id = response.new_id;
                this.model.add(id, date, type, vendor, city, state, amount, currency, paymentMethod, comment);
                this.clearInputs();
                this.displayAllExpenses();

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
    displayAllExpenses(){
        this.elementConfig.displayArea.empty();
        var allStudents = this.model.dataArray;
        for(var index = 0; index < allStudents.length; index++){
            var studentRow = allStudents[index].render();
            this.elementConfig.displayArea.append(studentRow);
        }
    }
}