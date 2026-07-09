import re

with open("frontend/student-demo.js", "r") as f:
    content = f.read()

# Fix the file input element not clearing
content = content.replace('// Send button handler', '''// Send button handler''')

content = content.replace('fileInputElem.files = null;', '') # reset

content = content.replace('renderExerciseChat(exercise.id, exercise, mainContentArea, mainTitle, mainDesc);\n            \n            // Simulate AI response', '''renderExerciseChat(exercise.id, exercise, mainContentArea, mainTitle, mainDesc);

            // Clear the file input if one was used
            if (hasFile) {
                fileInputElem.value = '';
            }

            // Simulate AI response''')


with open("frontend/student-demo.js", "w") as f:
    f.write(content)
