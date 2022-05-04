/*
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
*/

/** this variable provides a unique id to the attachment buttons.
 * getCount returns the current count and updateCount(x) updates the count.
**/
var atmCount = {
  count: 0,

  get getCount() {
    return this.count;
  },

  set updateCount(value) {
    this.count = this.count + value;
  }
};

/** this variable stores the chosen files **/
var chosenFiles = new Array();

/** Function that gets the most recently added files
 * @param = none.
 * @return = chosenFiles.
**/
function getFiles() {
  return chosenFiles;
}

/** Creates the attachment button
 * @param = none.
 * @return = btn. This button can add files and has a specific id for the
 * accompanied label.
**/
function createAttachButton() {
  var btn = document.createElement('input');
  btn.type = 'file';
  btn.id = 'attach-btn';
  btn.name = 'files[]';
  btn.multiple = true;
  return btn;
}

/** Creates the attachment indicator
 * @param = atmNr. This variable represents the id of the attachment.
 * @return = ind. This variable represents the indicator of the attachment.
**/
function createAttachIndicator(atmNr) {
  var ind = document.createElement('span');
  ind.id = 'file-chosen-' + atmNr;
  ind.innerHTML = 'No file chosen'
  return ind;
}

/** Creates the attachment list
 * @param = atmNr. This variable represents the id of the attachment.
 * @return = lst. This variable represents the list of attachments.
**/
function createAttachList(atmNr) {
  var lst = document.createElement('span');
  lst.id = 'fileList-' + atmNr;
  lst.innerHTML = 'Selected files:'
  return lst;
}

/** Give user option to add an attachment by creating a chatbot response,
 * which includes the attachment button
 * @param = none.
 * @return = none.
**/
function displayAtmButton() {
  var atmNr = atmCount.getCount;
  var btn = createAttachButton();
  var ind = createAttachIndicator(atmNr);
  var lst = createAttachList(atmNr);

  //Chatbot response, includes the attachment button
  let response = `Great! If necessary, you can add one or more attachments. <br>
                   <div class="attach-button">
                     <div class="attach-button-wrap">
                     <label name=choose-file class="attach-lbl" for="attach-btn"> Choose file </label>
                       ${btn.outerHTML}
                       ${ind.outerHTML}
                       ${lst.outerHTML}
                     </div>
                   </div>`;

  displayBotMessage(response);
  addAtmBtnEvents(atmNr);

  atmCount.updateCount = 1;
}

/** Adds event to the attachment button
 * @param = atmNr. This variable represents the id of the attachment.
 * @return = none.
**/
function addAtmBtnEvents(atmNr) {
  let atmBtn = document.getElementById('attach-btn');
  let fileChosen = document.getElementById('file-chosen-' + atmNr);

  //When change, display nr of files chosen and which files
  atmBtn.addEventListener('change', function() {

    // Checks for maximum file size, currently set at 8 mb
    if (atmBtn.files[0].size > 8 * 1024 * 1024) {
      displayBotMessage('This file is too large, it cannot be uploaded.');
      removeElements("choose-file");
      removeElements("AYL");
      displayAtmButton();
      checkAttachment();
      addAtmBtnEvents(atmNr);
    } else {
      // Update the indicator and currently chosen files
      if (atmBtn.files.length === 1) {
        fileChosen.textContent = atmBtn.files.length + ' file chosen:';
      } else {
        fileChosen.textContent = atmBtn.files.length + ' files chosen:';
      }

      chosenFiles = atmBtn.files;

      // Retrieve the chosen files as list
      var fileList = getFileList(chosenFiles);

      // Display which files are chosen
      var fl = document.getElementById('fileList-' + atmNr);
      fl.innerHTML = 'Selected files:' + fileList;

      // Keep the check message in screen when fileList has been updated
      messageCollection = document.getElementsByName("msg");
      message = messageCollection[messageCollection.length - 1];
      message.scrollIntoView();
    }
  });
}

/** Make a list of all attachment files, if files are added
 * @param = files. This variable represents all chosen files.
 * @return = if files are added returns filelist in a HTML list format
 * otherwise returns "no files added".
**/
function getFileList(files) {
  var fileList = "";

  if (files.length === 0) {
    return 'no files added';
  }

  for (var i = 0; i < files.length; ++i) {
    fileList += '<li>' + files.item(i).name + '</li>';
  }
  return '<ul>' + fileList + '</ul>';
}

/** Resets the id of the current attachment button, such that it can be re-used
 * again
 * @param = none.
 * @return = none.
**/
function removeAtmBtn() {
  var btn = document.getElementById('attach-btn');
  btn.parentNode.removeChild(btn);
}
