// ==UserScript==
// @name         FIST
// @namespace    http://tampermonkey.net/
// @version      2024-09-15v2
// @description  Fucking Illegal Spam Terminator
// @author       Graval504
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL    https://github.com/Graval504/MyExtension/raw/refs/heads/main/FIST.user.js
// @updateURL    https://github.com/Graval504/MyExtension/raw/refs/heads/main/FIST.user.js
// @grant        none
// @license      DBAD
// ==/UserScript==

// It may remove normal comment. but I couldn't see that much.

/*
Known Issues:
1. Few of \n around emoji become \r\n and it is filtered. idk how to solve this. - RESOLVED
2. Comment which is copied on Windows and also has multiple lines, it can be filtered. because this is how the code works.
*/

(function() {
    'use strict';

    let toastTimeout;
    var filteredComments = 0
    var showFiltered = document.createElement("button");
    var filteredList = document.createElement("ul");


    function createButton() {
        var container_contents = document.querySelector("#end");
        if (container_contents !== null) {
            var buttons = container_contents.querySelector("#FilteredComments-button"); // check for existing buttons
            if (buttons === null) {
                showFiltered.id = "FilteredComments-button";
                showFiltered.innerText = '0 💀';
                showFiltered.title = "ShowFilteredComments";
                showFiltered.style = "position:fiexed; min-height: 35px; color: var(--yt-spec-white-3); background-color: var(--yt-spec-black-3); border-radius: 18em; padding-top: 6px; padding-bottom: 5px; padding-left: 12px; padding-right: 12px; margin: 5px; border-width: 0px; cursor: pointer; ";
                filteredList.id = "FilteredComments-list";
                Object.assign(filteredList.style, {
                    position: 'fixed',
                    overflowY: 'scroll',
                    top: '50px',
                    left: '95%',
                    transform: 'translate(-100%, 0%)',
                    backgroundColor: 'rgba(252, 252, 252, 1)',
                    color: '#020202',
                    width: '250px',
                    maxHeight: '350px',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    display: 'none',
                    zIndex: '3000', // Ensure it's above other elements
                    listStyle: 'none',
                    borderStyle: 'solid',
                    borderWidth: '1.5px',
                    borderColor: '#020202'
                });
                showFiltered.addEventListener('click', function() {
                    if (filteredList.style.display === 'none') {
                        filteredList.style.display = 'block';
                    } else {
                        filteredList.style.display = 'none';
                    }
                });
                container_contents.prepend(showFiltered);
                document.body.prepend(filteredList);
                document.addEventListener('click', (event) => {if (!(filteredList.contains(event.target) || (showFiltered.contains(event.target)))) filteredList.style.display = 'none'});
            }
        }
    }

    function addCommentToList(comment) {
        const li = document.createElement('li');
        li.style.marginBottom = '8px'
        li.prepend(comment);
        filteredList.appendChild(li);
    }

    function clearSpam() {
        var comments = document.querySelectorAll('#contents > ytd-comment-thread-renderer');
        if(!comments) return;
        comments.forEach((comment, index) => {
            var commentText = comment.children.comment.querySelector('#content-text > span')
            var sus = false;
            for (var commentLine of commentText.childNodes) {
                if (sus) {
                    sus = false
                    // check there is emoji or timestamp
                    if (!(commentLine.querySelector(".yt-core-image") || commentLine.querySelector(".yt-core-attributed-string__link"))) {
                        console.log("[FIST]: removed spam comment - " + commentText.textContent);
                        filteredComments += 1;
                        showFiltered.innerText = filteredComments + ' 💀';
                        addCommentToList(commentText);
                        comment.remove();
                        return;
                    }
                }

                if (commentLine.textContent.includes('\r\n')) {
                    /* //good for eliminating spam but erase too much normal comments, which has multple lines.
                    if (commentLine.textContent.split('\r\n')[1].trim() != '') {
                        console.log("[FIST]: removed spam comment - " + commentText.textContent);
                        filteredComments += 1;
                        showFiltered.innerText = filteredComments + ' 💀';
                        addCommentToList(commentText);
                        comment.remove();
                        return;
                    }
                    */
                    sus = true;
                }

            }

            var replies = comment.children.replies.querySelectorAll('ytd-comment-view-model');
            replies.forEach((reply, index) => {
                var replyText = reply.querySelector('#content-text > span')
                var sus = false;
                for (var replyLine of replyText.childNodes) {
                    if (sus) {
                        sus = false
                        // check there is emoji or timestamp
                        if (!(replyLine.querySelector(".yt-core-image") || replyLine.querySelector(".yt-core-attributed-string__link"))) {
                            console.log("[FIST]: removed spam reply - " + replyText.textContent);
                            filteredComments += 1;
                            showFiltered.innerText = filteredComments + ' 💀';
                            addCommentToList(replyText);
                            reply.remove();
                            return;
                        }
                    }
                    if (replyLine.textContent.includes('\r\n')) {
                        if (replyLine.textContent.split('\r\n')[1].trim() != '') {
                            console.log("[FIST]: removed spam reply - " + replyText.textContent);
                            filteredComments += 1;
                            showFiltered.innerText = filteredComments + ' 💀';
                            addCommentToList(replyText);
                            reply.remove();
                            return;
                        }
                        sus = true;
                    }
                }
            });
        });
    }
    createButton();

    //script start
    console.log("[FIST]: loading FIST..")
    setInterval(clearSpam,1000)
    console.log("[FIST]: Active.")
})();
