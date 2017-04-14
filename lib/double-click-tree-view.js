'use babel';

import { CompositeDisposable } from 'atom';

export default {
    activate(state) {
        return atom.packages.activatePackage('tree-view').then((treeViewPkg) => {
            this.treeView = treeViewPkg.mainModule.createView();
            this.treeView.originalEntryClicked = this.treeView.entryClicked;
            console.log(this.treeView.originalEntryClicked.toString());
            this.treeView.entryClicked = function(e) {
                let entry = e.target.closest('.entry');
                let isRecursive = e.altKey || false;
                if (e.detail == 1 && entry.classList.contains('directory') && e.offsetX <= 10) {
                    entry.toggleExpansion(isRecursive);
                } else {
                    this.selectEntry(entry);
                    if (entry.classList.contains('directory')) {
                        if (e.detail > 1) {
                            entry.toggleExpansion(isRecursive);
                        }
                    } else if (entry.classList.contains('file')) {
                        this.fileViewEntryClicked(e);
                    }
                }
            }
        });
    },

    deactivate() {
        this.treeView.entryClicked = this.treeView.originalEntryClicked;
        delete this.treeView.originalEntryClicked;
    },

    entryDoubleClicked(e) {
        return this.originalEntryClicked(e);
    }
};