Similar to the crosswords puzzle logic I need to replicate the code but with the difference that this is only a 6 x 6 grid with individual squares stacked next to each other to form the grid and numbered 1 to 36. 
Also the letter selection logic is a bit different, where the letters will be arranged in the form of a clock dial where the clock numbeers will be replaced by malayalam letters. 
Each square will be given a number in black on the top right corner.

The correct letter positions for each are as below,

square 6 - മ
square 11 - കോ
square 12 - ണി
square 16 - ആ
square 17 - ഴി
square 20 - ചീ
square 21 - വീ
square 22 - ട്
square 25 - അ
square 26 - ര
square 27 - ണ
square 31 - കം

Clock Dial style circle and each letter position details below,

12 o clock position - മ
1 o clock position - കോ
2 o clock position - ഴി
3 o clock position - ണ
4 o clock position - ആ
5 o clock position - വീ
6 o clock position - ട്
7 o clock position - ചീ
8 o clock position - ര
9 o clock position - കം
10 o clock position - അ
11 o clock position - ണി

The grid will be filled with these letters randomly and the user will have to select the letters in a sequence to form valid Malayalam words. 
The user can select letters by touch and drag and a line streak will follow the touch and drag motion. The letters that are selected will be highlighted and once the user lifts their finger the selected letters will be checked against a predefined list of valid Malayalam words. If the selected sequence forms a valid word, those letters will remain highlighted and the user will score points based on the length of the word formed but that matches the crossword. 
For each correct word formed the letters will automatically fill the correct positions in the grid as per the above mapping. If there is a word formed outside the scope of the dictionary or the crossword mapping, the letters will revert back to their original state and the user will not score any points., it will be said as incorrect. If words are duplicated, it will be saying already found. If correct it will say great job.

To further clarify, the drag and drop logic is not working as expected. Like i said upon a letter touch the letter remains selected until the             │
│   mouse is released. For example if i want to select the letters ചീ i press ചീ and keep holding the mouse button down and drag          │
│   it across to letter വീ where on the way to വീ a streak line is formed, then without lifting the mouse button proceed to ട്            │
│   and then release the button. Therefore the letters are concatenated to form the word ചീവീട്. Then the logic checks whether            │
│   the word is in the dictionary, if yes it sends these letters to the correct positions as per the square grid mapping                  │
│   positions and then a message "Great job. Correct word found" at the bottom outside of the crossword container . Hope                  │
│   sequence is clear.   

For reference, Dictionary words are as follows, Across കോണി, ആഴി, ചീവിട്, അരണ while down words are മണി, കോഴി, ആട്, വീണ ,ചീര, അകം. The dictionary can be invisible and the player does not need to see it.

Hope everything is clear. Please let me know if you need any more details.

