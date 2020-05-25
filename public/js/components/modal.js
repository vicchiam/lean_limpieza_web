Vue.component('chis-modal', {
    /*
        id -> identificador de la modal
        title -> titulo de la ventana
        lg -> tamaño grande o normal
    */
    props:['id','title','lg'],
    template:`
        <div class="modal" :id="id" role="dialog" aria-hidden="true">
            <div class="modal-dialog" :class="{ 'modal-lg': lg}" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalTitle">{{ title || 'Title' }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="modalBody">
                        <slot name="body">Cuerpo</slot>
                    </div>
                    <div class="modal-footer" id="modalFooter">
                        <slot name="foot">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    `
});
/*
.chis-autocomplete-item:hover{ 
    background-color: #007bff; 
    color: #ffffff 
}
.chis-autocomplete-item.active{ 
    background-color: #007bff; 
    color: #ffffff 
}
*/