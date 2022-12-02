tab = [
    {
        name: "1 elem",
        id: 0,
        type: "FOLDER",
        active: false,
        items: [
            {
                name: "2 elem",
                type: "FOLDER",
                id: 1,
                active: false,
                items: [
                    {
                        name: "3 elem ok !!",
                        type: "FOLDER",
                        id: 2,
                        active: false,
                        items: []
                    }
                ]
            }
        ]
    },
    {
        name: "1 autre elem",
        type: "FOLDER",
        id: 3,
        active: false,
        items: [
            {
                name: "2 autre :o elem",
                type: "FOLDER",
                id: 4,
                active: false,
                items: [
                    {
                        name: "3 finished ??",
                        type: "FOLDER",
                        id: 5,
                        active: false,
                        items: []
                    }
                ]
            }
        ]
    },
    {
        name: "1autreee",
        type: "FOLDER",
        id: 6,
        active: false,
        items: [
            {
                name: ":)",
                type: "FOLDER",
                id: 7,
                active: false,
                items: [
                    {
                        name: "cc",
                        type: "FOLDER",
                        id: 8,
                        active: false,
                        items: []
                    }
                ]
            }
        ]
    }
]

function all(tab) {
    function test(tab) {
        for (let i = 0; i < tab.length; i++) {
            if (tab[i].id === 2) {
                tab[i].name = "t"
            }
            test(tab[i].items)
        }
    }
    test(tab)
    console.log(tab)
}
all(tab)
console.log(tab)
// console.log(tab)