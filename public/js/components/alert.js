Vue.component('chis-alert', {
    /*
        show-> muestra o no la ventana
        width-> tamaño de la ventana
        title-> titulo de la ventana
        message-> mensaje que aparecera
        yes-> titulo del boton si, si no es vacio aparecera
        no-> titulo del boton no, si no es vacio aparecera
        neutral-> titulo del boton neutral, si no es vacio aparecera
    */
    props:{
        show: {
            type: Boolean,
            required: true
        },
        width: {
            type: Number,
            required: false,
            default: 500
        },
        title: {
            type: String,
            required: false,
            default: 'Title'
        },
        message: {
            type: String,
            required: false,
            default: 'This is a alert!!!'
        },
        yes: {
            type: String,
            required: false,
            default: ''
        },
        no: {
            type: String,
            required: false,
            default: ''
        },
        neutral: {
            type: String,
            required: false,
            default: 'Cancel'
        }
    },
    template:`        
        <div v-show="show">        
            <div id="alert-modal-background" class="position-fixed" style="top:0px;left:0px;background-color:#333;width:100%;height:100%;z-index:1100;opacity:0.6" @click="$emit('cancel')"></div>
            <div id="alert-window" class="position-fixed" :style="{ width: width+'px', marginLeft: marginLeft+'px' }" style="top:5%;left:50%;border:1px solid rgba(0,0,0,.2);border-radius:.3rem;background-color:#fff;z-index:1101">
                <div class="p-2" style="border-bottom:1px solid rgba(0,0,0,.2)">
                    <span class="d-inline-block float-right" style="width:20px;height:20px;color:#666;font-size:20px;cursor:pointer;line-height:1;margin:-4px -4px -4px auto" @click="$emit('cancel')">&times;</span>
                    <h5 class="titulotest">{{ title }}</h5>                    
                </div>
                <div class="p-2 pl-3 pr-3 mt-3 mb-3">
                    {{ message }}
                </div>
                <div class="p-2" style="border-top:1px solid rgba(0,0,0,.2)">
                    <div class="m-1 text-right">
                        <button v-show=" neutral.length>0 " class="btn btn-secondary" @click="$emit('cancel')">{{ neutral }}</button>                        
                        <button v-show=" no.length>0 " class="btn btn-secondary" @click="$emit('no')">{{ no }}</button>                        
                        <button v-show=" yes.length>0 " class="btn btn-danger" @click="$emit('yes');$emit('cancel')">{{ yes }}</button>                        
                    </div>
                </div>
            </div>
        </div>
    `,    
    computed:{
        marginLeft(){
            return Math.floor(this.width/2)*-1;
        }
    }
})