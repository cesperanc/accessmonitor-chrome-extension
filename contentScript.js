/**
 * This source code is licensed under the GPLv3 license.
 * 
 * Copyright (c) 2024 Norberto Sousa e Cláudio Esperança <cesperanc@gmail.com>
 */
(() => {
    const onLoad = () => {
        const resultsTableSelector = 'table.table_primary';
        const hook = (resultsTable)=>{
            if(!resultsTable) return; // If the table is not found, return
            let activeButton = "Prática para ver manualmente"; // Track active button
            // Function to announce the alert with the provided message
            const announceAlert = (message)=>{
                const alertElement = document.createElement('div');
                alertElement.setAttribute('role', 'alert');
                alertElement.textContent = message;
                document.body.appendChild(alertElement);
                setTimeout(() => {
                    alertElement.remove();
                }, 5000); // Remove the alert after 5 seconds
            };

            const filterTheLines = (name)=>{
                const nameNormalized = name.trim().toLowerCase();
                let filteredCount = 0;

                Array.from(resultsTable.querySelectorAll('tbody>tr')).map(tr=>{
                    const showAline = Array.from(tr.querySelectorAll('.error-cell>.visually-hidden,.warning-cell>.visually-hidden,.success-cell>.visually-hidden')).filter(title=>title.textContent.trim().toLowerCase()===nameNormalized).length>0;
                    if(showAline || name==="" || !name){
                        tr.removeAttribute("hidden");
                        filteredCount++;
                    } else {
                        tr.setAttribute("hidden", null);
                    }
                });

                // Create and announce alert with the active button name and number of results
                const alertMessage = `${activeButton}: ${filteredCount} resultados`;
                announceAlert(alertMessage);
            };

            const btnsFieldset = document.createElement('fieldset');
            const btnsFieldsetLegend = document.createElement('legend');
            btnsFieldsetLegend.innerHTML = `Filtros:`;
            btnsFieldset.appendChild(btnsFieldsetLegend);

            btnsFieldset.classList.add('custom-filter-buttons');
            const btnsFieldsContainer = document.createElement('div');
            btnsFieldsContainer.classList.add('buttons-container');

            ["Tudo", "Prática para ver manualmente", "Prática não aceitável", "Prática aceitável"].forEach(item=>{
                const filterBtn = document.createElement('button');
                filterBtn.setAttribute('data-filter-btn', item);
                filterBtn.innerHTML = item;
                filterBtn.addEventListener('click', (ev)=>{
                    ev.preventDefault();
                    activeButton = item; // Update active button
                    filterTheLines(item==="Tudo"?"":item);
                    // Set aria-pressed attribute for the active button
                    filterBtn.setAttribute('aria-pressed', 'true');
                    // Set aria-pressed attribute to false for other buttons
                    document.querySelectorAll('button').forEach(button => {
                        if (button !== filterBtn) {
                            button.setAttribute('aria-pressed', 'false');
                        }
                    });
                });
                btnsFieldsContainer.appendChild(filterBtn);
            });
            btnsFieldset.appendChild(btnsFieldsContainer);
            resultsTable.insertAdjacentElement('beforebegin', btnsFieldset);
            document.querySelector('button[data-filter-btn="Tudo"]').dispatchEvent(new Event('click')); // Trigger click event on the "Tudo" button
        };

        const hookTables = (tables)=>{
            if(tables.length>0){
                tables.forEach(table=>{
                    hook(table);
                });
            }
        }

        /**
         * Mutation observer that listens for changes in the DOM and triggers a callback function when the results table element is added.
         *
         * @param {Array<MutationRecord>} mutationsList - List of mutation records.
         * @param {MutationObserver} observer - The mutation observer instance.
         */
        const observer = new MutationObserver((mutationsList, observer)=>{
            for(let mutation of mutationsList){
                if(mutation.type === 'childList' && mutation.addedNodes.length>0){
                    Array.from(mutation.addedNodes).forEach(node=>{
                        if(node.nodeType === Node.ELEMENT_NODE){
                            const resultsTables = node.querySelectorAll(resultsTableSelector);
                            if(resultsTables.length>0){
                                hookTables(resultsTables);
                            }
                            if(node.matches(resultsTableSelector)){
                                hook(node);
                            }
                        }
                    });
                }
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
        // If the results table is already present in the DOM, hook it
        hookTables(document.querySelectorAll(resultsTableSelector));
    };

    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', onLoad);
    }else{
        onLoad();
    }
})();
