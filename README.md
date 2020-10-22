## React Sudoku Solver. Author J.P. Solano

This is a fresh attempt to port Peter Norvig's @norvig legendary Sudoku Solver from an hyper-efficient python base code
to JS. See http://norvig.com/sudoku.html for his article and explanations.

The latest js version that port Peter code was from 2014 (thanks to @einaregilsson /sudoku !)

[LIVE DEMO HERE](http://jsolano.github.io/react-sudoku-solver)

[Article in dev.to](https://dev.to/jsolano/building-a-react-app-to-solve-every-sudoku-puzzle-3c95)

![image](https://github.com/jsolano/react-sudoku-solver/blob/master/src/assets/preview.png)

## General idea:

Initially was just create a react app that used Peter Norvig's approach to solve any sudoku puzzle while collecting all steps to learn. But, Peter Norvig used a backtracking search strategy, and what it does is systematically try all possibilities until it hit one that works. In the search of a solution create temp steps that are not valid, making the learning part pointless.

Then I did my research about others sudoku solving strategies, and there are more than 38 options! I was hook. See more here [https://www.sudokuwiki.org/sudoku.htm](https://www.sudokuwiki.org/sudoku.htm).

But it comes with a caveats: you can produce many lines of code trying to implement some of this strategies and still won't solve all puzzles. (I learned this the hard way). So, here is a mixed approach: Create a react app that use human solving strategies (for learning purposes and because it's fun!) and only apply Peter Norvig's nuclear solver as the last option.

## List of Sudoku solver strategies:

more detail here: [https://www.sudokuwiki.org/sudoku.htm](https://www.sudokuwiki.org/sudoku.htm)

1. Hidden Singles **SUPPORTED**
2. Naked Pairs/Triples **SUPPORTED**
3. Pointing Pairs **SUPPORTED**
4. Hidden Pairs/Triples
5. Naked/Hidden Quads
6. Box/Line Reduction
7. X-Wing (Tough Strategies)
8. Simple Colouring
9. Y-Wing
10. Swordfish
11. XYZ Wing
12. X-Cycles (Diabolical Strategies)
13. BUG
14. XY-Chain
15. 3D Medusa
16. Jellyfish
17. Unique Rectangles
18. SK Loops
19. Extended Unique Rect.
20. Hidden Unique Rect's
21. WXYZ Wing
22. Aligned Pair Exclusion
23. Exocet (Extreme Strategies)
24. Grouped X-Cycles
25. Empty Rectangles
26. Finned X-Wing
27. Finned Swordfish
28. Altern. Inference Chains
29. Sue-de-Coq
30. Digit Forcing Chains
31. Nishio Forcing Chains
32. Cell Forcing Chains
33. Unit Forcing Chains
34. Almost Locked Sets
35. Death Blossom
36. Pattern Overlay Method
37. Quad Forcing Chains
38. Bowman's Bingo

Last strategy: Backtracking Search **SUPPORTED**

Feel free to fork this project and open a PR with any improve or new strategy implementation.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Next Steps

1. In the modal for Load a new Board, Add a button to select a random puzzle string.

Below you will find some information on how to perform common tasks.<br>

## Available Scripts

In the project directory, you can run:

Before anything:

### `npm install | yarn`

After

### `npm|yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm|yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm|yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `npm|yarn run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Supported Browsers

By default, the generated project uses the latest version of React.

You can refer [to the React documentation](https://reactjs.org/docs/react-dom.html#browser-support) for more information about supported browsers.
