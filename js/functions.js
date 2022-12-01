function fileManager(data) {
    let titleTop = data.titleTop || "fileManager"
    let titleLeft = data.titleLeft || "Files structure"
    let titleRight = data.titleRight || "files"
    let container = data.container || "container"
    let topBackgroundColor = data.topBackgroundColor || "white"
    let leftBackgroundColor = data.leftBackgroundColor || "white"
    let rightBackgroundColor = data.rightBackgroundColor || "white"
    let borderColor = data.borderColor || "black"
    let textColor = data.textColor || "black"
    let buttonHeight = data.buttonHeight || 25
    let borderWidth = data.borderWidth || 3
    let borderRadius = data.borderRadius || 5
    let outerBorderShow
    let borderShow
    typeof (data.outerBorderShow) === "undefined" ? outerBorderShow = true : outerBorderShow = data.outerBorderShow
    typeof (data.borderShow) === "undefined" ? borderShow = true : borderShow = data.borderShow
    let leftPanelWidth = data.leftPanelWidth || 150
    let topPanelHeight = data.topPanelHeight || 50
    let textHeight = data.textHeight || 30
    let textStyle = data.textStyle || "Sans-serif"
    let cardTextHeight = data.cardTextHeight || 20
    let cardFolderBackgroundColor = data.cardBackgroundColor || "#B4B4B4"
    let cardFileBackgroundColor = data.cardBackgroundColor || "##87BC86"
    let cardHeight = data.cardHeight || ""
    let cardMaxTextLength = data.cardMaxTextLength || 15
    let cardWidth = data.cardWidth || 250

    const editFolderById = (id, obj) => {
        const recursive = (items) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === "FOLDER" && items[i].id === id) {
                    items[i] = { ...items[i], ...obj }
                }
                recursive(items[i].items)
            }
        }
        recursive(items)
        updateFilesItemsStructure()
    }

    const deleteFolderById = (id) => {
        const _index = items.findIndex(e => e.id === id)
        if (_index === -1) {
            let lastRef = undefined
            const recursive = (items) => {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type === "FOLDER" && items[i].id === id) {
                        lastRef.items = []
                    }
                    else {
                        lastRef = items[i]
                        recursive(items[i].items)
                    }
                }
            }
            recursive(items)
        }
        else {
            items.splice(_index, 1)
        }
        updateFilesItemsStructure()
    }
    const getFolderById = (id) => {
        let findId = -1
        const recursive = (items) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === "FOLDER" && items[i].id !== id) {
                    recursive(items[i].items)
                }
                else if (items[i].type === "FOLDER" && items[i].id === id) {
                    findId = items[i]
                }
            }
        }
        recursive(items)
        return findId
    }
    const manageCardName = (text) => {
        if (text.length >= cardMaxTextLength) {
            return `${text.substring(0, cardMaxTextLength)}...`
        }
        return text
    }
    const getPathName = (id) => {
        let find = false
        let _path = "."
        const recursive = (items) => {
            if (pathId === -1) {
                return "./"
            }
            else {
                for (let i = 0; i < items.length; i++) {

                    if (items[i].type === "FOLDER" && items[i].items.length >= 1 && items[i].id !== id && !find) {
                        _path += `/${items[i].name}`
                        recursive(items[i].items)
                    }
                    else if (items[i].id === id && items[i].type === "FOLDER" && !find) {
                        _path += `/${items[i].name}`
                        find = true
                    }
                }
                if (!find) {
                    _path = ""
                }
            }
            if (!find) {
                _path = "./"
            }
        }
        recursive(items)
        return _path
    }

    let marginTopElements = 25

    let itemId = 0 // Increment this value each time we add a new folder or file
    let items = [
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

    let pathId = 2

    const virtualPath = getPathName(1)

    let fileManagerName = "__Item__FileManager__"
    $(`#${container}`).append(
        `<div style="width: 100%; height: 100%; box-sizing: border-box; border-radius: ${borderRadius}px; border: ${outerBorderShow ? `solid ${borderColor} ${borderWidth}px;` : "none"}; font-size: ${textHeight}px; font-family: ${textStyle}; color: ${textColor}; border-color: ${borderColor}; user-select: none;;">
            <div style="width: calc(100% + 1px); height: ${topPanelHeight}px; box-sizing: border-box; border-radius: ${borderRadius}px; display: flex; align-items: center; padding: 5px; background-color: ${topBackgroundColor}; border-color: ${borderColor}; border: ${borderShow ? `solid ${borderColor} ${borderWidth}px` : "none"};">
                <label>${titleTop}</label>
                <div class="${fileManagerName}" id="__addFolder" style="width: ${buttonHeight}px; height: ${buttonHeight}px; border-color: ${textColor}; border: solid ${textColor} 2px; border-radius: 5px; padding: 5px; margin: 0px ${marginTopElements}px; text-align: center;">
                    <svg style="fill: ${textColor}; width: ${buttonHeight}px; pointer-events: none;" viewBox="0 0 512 512"><path style="pointer-events: none;" d="M447.1 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H63.1c-35.35 0-64 28.66-64 64v320c0 35.34 28.65 64 64 64h384c35.35 0 64-28.66 64-64V160C511.1 124.7 483.3 96 447.1 96zM463.1 416c0 8.824-7.178 16-16 16h-384c-8.822 0-16-7.176-16-16V96c0-8.824 7.178-16 16-16h117.5c4.273 0 8.293 1.664 11.31 4.688L255.1 144h192c8.822 0 16 7.176 16 16V416z"/></svg>
                </div>
                <div class="${fileManagerName}" id="__importFile" style="width: ${buttonHeight}px; height: ${buttonHeight}px; border-color: ${textColor}; border: solid ${textColor} 2px; border-radius: 5px; padding: 5px; margin: 0px ${marginTopElements}px; text-align: center;">
                    <svg style="fill: ${textColor}; height: ${buttonHeight}px; width: ${buttonHeight}px; pointer-events: none;" viewBox="0 0 384 512"><path style="pointer-events: none;" d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z"/></svg>
                </div>
                <div class="${fileManagerName}" id="__goBack" style="width: ${buttonHeight}px; height: ${buttonHeight}px; border-color: ${textColor}; border: solid ${textColor} 2px; border-radius: 5px; padding: 5px; margin: 0px ${marginTopElements}px; text-align: center;">
                <svg style="fill: ${textColor}; width: ${buttonHeight}px; pointer-events: none;" viewBox="0 0 512 512"><path style="pointer-events: none;" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256S114.6 512 256 512s256-114.6 256-256zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/></svg>
                </div>
                <div style="overflow-x: auto; width: 100%;">
                    <label style="white-space: nowrap;">${virtualPath}</label>
                </div>
                <div class="${fileManagerName}" id="__goForward" style="width: ${buttonHeight}px; height: ${buttonHeight}px; border-color: ${textColor}; border: solid ${textColor} 2px; border-radius: 5px; padding: 5px; margin: 0px ${marginTopElements}px; text-align: center;">
                    <svg viewBox="0 0 512 512" style="fill: ${textColor}; width: ${buttonHeight}px; pointer-events: none;"><path style="pointer-events: none;" d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z"/></svg>
                </div>
            </div>
            <div style="display: flex; width: 100%; height: 100%;">
                <div style="width: ${leftPanelWidth}px; height: calc(100% - ${topPanelHeight}px); box-sizing: border-box; border-radius: ${borderRadius}px; text-align: center; display: flex; flex-flow: column; overflow: auto; background-color: ${leftBackgroundColor}; border-color: ${borderColor}; border: ${borderShow ? `solid ${borderColor} ${borderWidth}px;` : "none"}">
                    <label>${titleLeft}</label>
                    <div id="_filesItemsStructure" style="width: 100%; overflow-y: scroll; height: 100%; font-size: ${cardTextHeight}px;"></div>
                </div>
                <div style="border-radius: ${borderRadius}px; width: calc(100% - ${leftPanelWidth}px); height: calc(100% - ${topPanelHeight}px); box-sizing: border-box; text-align: center; display: flex; flex-flow: column; overflow: auto; background-color: ${rightBackgroundColor}; border-color: ${borderColor}; border: ${borderShow ? `solid ${borderColor} ${borderWidth}px` : "none"};">
                    <label>${titleRight}</label>
                    <div id="_filesItems" style="width: 100%; overflow-y: scroll; height: 100%;"></div>
                </div>
            </div>
        </div>`
    )

    const updateFilesItemsStructure = () => {
        $(`#_filesItemsStructure`).children().remove()
        let margin = 0
        const decal = 15
        const recursive = (items) => {
            margin++
            for (let i = 0; i < items.length; i++) {
                switch (items[i].type) {
                    case "FOLDER":
                        $(`#_filesItemsStructure`).append(`<div style="width: ${cardWidth}px; height: ${cardHeight}px; background-color: ${cardFolderBackgroundColor}; margin-left: calc((5px + ${(margin * decal)}px) - ${decal}px); margin-bottom: 5px; border-radius: ${borderRadius}px;">
                            <div style="display: flex;">

                                <div class="_activeCardChildren ${items[i].active ? "active" : "no-active"}" id="_FileStructure_${items[i].id}" style="width: 15px; height: 15px; padding: 0px; margin-left: 5px; display: flex; margin-top: 3px;">
                                    ${items[i].active ? `<svg style="fill: ${textColor}; pointer-events: none; margin-left: 3px; margin-top: -6px;" viewBox="0 0 320 512"><path style="pointer-events: none;" d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>` : `<svg viewBox="0 0 256 512" style="fill: ${textColor}; pointer-events: none; margin-left: 3px;">
                                    <path style="pointer-events: none;" d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"/>
                                </svg>`}
                                </div>
                                <div style="justify-content: center; align-items: center; width: 100%;">
                                    <label>${manageCardName(items[i].name)}</label>
                                </div>
                            </div>
                        
                            <!-- <div class="_activeCardChildren" id="${items[i].id}" style="border-radius: 3px; width: 15px; height: 15px; border: solid ${borderColor} 2px; padding: 0px; float: right; margin-right: 5px; margin-top: -${cardTextHeight}px; display: flex;">
                                <label style="font-size: 15px; padding: 0px; pointer-events: none; margin-left: 4px; margin-top: -2px;">x</label>
                            </div> -->
                        </div>`)
                        if (items[i].items.length >= 1 && items[i].active) {
                            recursive(items[i].items)
                        }
                        break
                    case "FILE":
                        $(`#_filesItemsStructure`).append(`<div style="width: calc(100% - 10px); height: 35px; background-color: #83CBCF; margin: 2px 0px;"></div>`)
                }
            }
            margin--
        }
        recursive(items)
        $('._activeCardChildren').on('mouseenter', (e) => {
            $("body").css('cursor', "pointer")
        })
        $('._activeCardChildren').on('mouseleave', (e) => {
            $("body").css('cursor', "default")
        })
        $('._activeCardChildren').on('click', (e) => {
            let elemId = e.target.id
            if (typeof (data.onDeleteCardFocus) !== "undefined") {
                data.onDeleteCardFocus(getFolderById(+elemId))
            }
            // deleteFolderById(+elemId)
            if ($(`#${elemId}`).attr('class').split(" ")[1] === "active") {
                $(`#${elemId}`).removeClass("active").addClass("no-active")
                editFolderById(+elemId.split('_')[2], { active: false })
            }
            else {
                $(`#${elemId}`).removeClass("no-active").addClass("active")
                editFolderById(+elemId.split('_')[2], { active: true })
            }
        })
    }

    updateFilesItemsStructure()

    $(`.${fileManagerName}`).on('mouseenter', (e) => {
        $("body").css('cursor', "pointer")
    })
    $(`.${fileManagerName}`).on('mouseleave', (e) => {
        $("body").css('cursor', "default")
    })

    $(`.${fileManagerName}`).on('click', (e) => {
        let elemId = e.target.id

        switch (elemId) {
            case "__addFolder":
                if (typeof (data.onAddFolderFocus) !== "undefined") {
                    data.onAddFolderFocus()
                }
                break
            case "__importFile":
                if (typeof (data.onImportFileFocus) !== "undefined") {
                    data.onImportFileFocus()
                }
                break
            case "__goBack":
                if (typeof (data.onGoBackFocus) !== "undefined") {
                    data.onGoBackFocus()
                }
                break
            case "__goForward":
                if (typeof (data.onGoForwardFocus) !== "undefined") {
                    data.onGoForwardFocus()
                }
                break
        }
    })
    deleteFolderById(2)
    return {

    }
}