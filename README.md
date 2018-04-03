# tampermonkey

A collection of useful tampermonkey scripts.

## TOC - Table Of Contents

Creates a table of contents (toc) overlay.
The script is searching for headlines in the content area and creates a formatted link list as toc. You can collapse/expand it by clicking on the hide/show button.

![Screenshot of the generated toc](toc - table of contents\Wikipedia - LZ 129 Hindenburg.png)

There is a plugin mechanism to define page specific things:
* *contentSelector* selector for the content area
* *processHeadline* function to process a headline in the content area (e.g. to parse the headline or to add an id for an anchor link)
* *createTocEntry* function to create a single entry for the toc
