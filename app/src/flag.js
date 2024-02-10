'use strict';

function traverse(root) {
  if (root == null) {
    return;
  }
  
  root.childNodes.forEach(child => {
    console.log(child)
    traverse(child);
  });
}

const Flag = () => {
  const root = document.body;
    traverse(root);
};

export default Flag;
