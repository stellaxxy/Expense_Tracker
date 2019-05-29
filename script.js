/* information about jsdocs:
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
*
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready( startApp );

var SGT;
function startApp(){
    SGT = new SGT_template({
        addButton: $("#addButton"),
        addModalButton: $('#addModalButton'),
        cancelButton: $("#cancelButton"),
        typeInput: $("#expenseType"),
        dateInput: $("#expenseDate"),
        vendorInput: $("#vendor"),
        cityInput: $("#city"),
        stateInput: $("#state"),
        amountInput: $("#amount"),
        currencyInput: $("#currency"),
        paymentMethodInput: $("#paymentMethod"),
        commentInput: $("#comment"),
        displayArea: $("#displayArea"),
        deleteConfirmButton: $('#deleteConfirmModalButton'),
        deleteButton: $('.deleteBtn'),
        updateButton: $('.updateBtn'),
        updateCancelButton: $('.updateCancelBtn'),
        updateConfirmButton: $('.updateConfirmBtn'),
        searchType: $('.searchType li'),
        searchAll: $('.searchAll'),
        addButtonOnSmall: $('.addBtnContainer span'),
        searchSubMenu: $('.dropdown-submenu a'),
        addFormTypeInput: $('#addExpenseType'),
        addFormDateInput: $('#addExpenseDate'),
    });
    SGT.addEventHandlers();
    SGT.model.handleSelectAllClick();
    closeButtonClick();
}

function closeButtonClick(){
    $('.closeButton').click(closeButtonHandler);
}

function closeButtonHandler (){
    $('.errorMessage').hide();
}
