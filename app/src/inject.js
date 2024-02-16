'use strict';
const MyDark={"element":"","Pattern":""}
// Add click event listener to the document
function letUserSelectElement(request, sender, sendResponse) {
    const style = document.createElement('style');
    style.textContent =' * {border: 2px solid red !important;}';
    document.head.appendChild(style);

    document.addEventListener('click', (event) => {
        console.log(event.target.outerHTML);

        // Remove the style element
        style.textContent = 'body {position: relative}';

        // prevent propagation
        event.stopPropagation();
        event.preventDefault();

      
        // create modal to ask the user what dark pattern the selected div is
        let modal = document.createElement('div')
        document.body.style.width = '100%'
        document.body.style.height = '100%'
        // modal.style.display = 'flex';

        // set the height and width of the modal
        modal.style.width = '50%'; modal.style.height = '50%';
        modal.style.minWidth = '50%'; modal.style.minHeight = '50%';
        modal.style.backgroundColor = 'black'; modal.textContent = "What dark patterns did you notice?";

        // add padding to the modal
        modal.style.marginLeft = '25%'; modal.style.paddingLeft = '2%';
        modal.style.marginRight = '25%'; modal.style.paddingRight = '2%';
        modal.style.marginTop = '25%'; modal.style.paddingTop = '2%';
        modal.style.marginBottom = '25%'; modal.style.paddingBottom = '5%';

        // add options with fontcolor grey
        modal.style.color = '#808080'
        modal.style.fontFamily = 'courier, courier new, serif'

        // options for user to select from
        let options = [
            'scarcity', 'false urgency', 'confirm shaming',
            'forced action', 'nagging', 'interface interference',
            'bait and switch', 'disguised advertisement', 'subscription trap'
        ];

        options.forEach((option) => {
            let button = document.createElement('strong');
            button.style.display = 'block';
            button.textContent = option;
            button.classList.add('darkPattern')

            button.style.border = 'solid white 2px';
            button.style.transition = 'transform .2s';

            // add hover based css when button isnt selected
            button.addEventListener('pointerenter', () => {
                if (!button.classList.contains('selected')) {
                    button.style.border = 'solid grey 2px';
                }
            })
            button.addEventListener('pointerleave', () => {
                if (!button.classList.contains('selected')) {
                    button.style.border = 'solid white 2px';
                }
            })

            button.addEventListener('click', () => {
                if (button.classList.contains('selected')) {
                    button.classList.remove('selected');
                    button.style.transform = 'scale(1)';
                } else {
                    button.classList.add('selected');
                    button.style.transform = 'scale(1.05)';
                }
            })

            modal.appendChild(button);
        })

        let submit = document.createElement('div');
        submit.classList.add('submit'); submit.textContent = 'submit';
        submit.style.display = 'flex'; submit.style.border = 'solid white 2px'
        submit.style.marginLeft = '20%'; submit.style.marginRight = '20%';
        submit.style.justifyContent = 'center';


        submit.addEventListener('click', () => {
            const dataToLog = {
                elementOuterHTML: event.target.outerHTML,
                selectedPatterns: Array.from(document.querySelectorAll('.selected')).map((darkPattern) => darkPattern.textContent) 
            };
        
            console.log(dataToLog);
        
            chrome.runtime.sendMessage({ 
                type: "SELECTED_INPUT", 
                selected: event.target.outerHTML,
                patterns: Array.from(document.querySelectorAll('.selected')).map((darkPattern) => darkPattern.textContent) 
            });
           // MyDark.Pattern=Array.from(document.querySelectorAll('.selected'));
            modal.parentNode.removeChild(modal);
            console.log(modal);
            //MyDark.element=modal;
        })

        submit.addEventListener('pointerenter', () => {
            submit.style.border = 'solid grey 2px';
        })
        submit.addEventListener('pointerleave', () => {
            submit.style.border = 'solid white 2px';
        })

        modal.appendChild(submit);
        document.body.style.position = 'relative !important'
        modal.style.position = 'fixed';
        modal.style.zIndex = 2147483647;
        modal.classList.add('injectedModal')
        document.body.insertBefore(modal, document.body.firstChild);
        // document.body.appendChild(modal);
    }, { capture: true, once: true });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SELECT_MODE') {
        letUserSelectElement(request, sender, sendResponse);
    }
});