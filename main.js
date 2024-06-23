document.addEventListener('DOMContentLoaded', function() {
    var searchInput = document.querySelector('#default-search');
    var listContainer = document.querySelector('.suggestion-list');

    var appList = [{
            title: 'About',
            link: './about.html'
        },
        {
            title: 'Music',
            link: './coming.html'
        },
        {
            title: 'Projects',
            link: './project.html'
        },
    ];

    searchInput.addEventListener('keyup', generateAppList);
    searchInput.addEventListener('focus', generateAppList); // Show suggestions on focus
    searchInput.addEventListener('blur', hideAppList);

    function generateAppList(event) {
        var userInput = event.target.value.toLowerCase();
        var fragment = document.createDocumentFragment();

        if (userInput.length === 0 && event.type === 'keyup') {
            listContainer.classList.add('hidden');
            return false;
        }

        listContainer.innerHTML = '';
        listContainer.classList.remove('hidden');

        var filteredList = appList.filter(function(app) {
            return app.title.toLowerCase().includes(userInput);
        });

        if (filteredList.length === 0) {
            let paragraph = document.createElement('p');
            paragraph.classList.add('suggestion-item');
            paragraph.innerText = 'No app found';
            fragment.appendChild(paragraph);
        } else {
            filteredList.forEach(function(app) {
                let paragraph = document.createElement('p');
                paragraph.classList.add('suggestion-item');
                paragraph.innerText = app.title;

                paragraph.addEventListener('click', function() {
                    window.open(app.link, '_blank');
                    hideAppList();
                });

                fragment.appendChild(paragraph);
            });
        }

        listContainer.appendChild(fragment);
    }

    function hideAppList() {
        setTimeout(function() {
            listContainer.classList.add('hidden');
        }, 200); // Delay to allow click event to register
    }
});