import java.util.ArrayList;
import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.Random;

class Game {
    ArrayList<ArrayList<Integer>> board = new ArrayList<>();
    ArrayList<ArrayList<Canvas>> panels = new ArrayList<>();
    private Random random = new Random();
    public JFrame window = new JFrame();

    public Game() {
        // setup code
        setupWindow();
        setupBoard();
    }

    public void setupBoard() {
        for (int y = 0; y < 4; y++) {
            board.add(new ArrayList<>());
            panels.add(new ArrayList<>());
            ArrayList<Integer> row = board.get(y);
            ArrayList<Canvas> panel_row = panels.get(y);
            for (int x = 0; x < 4; x++) {
                Canvas square = new Canvas();
                square.setBackground(Constants.SQUARE_BACKGROUND_COLOR);
                square.setSize(Constants.WIDTH / 4 - 2 * Constants.BORDER_WIDTH, Constants.HEIGHT / 4);
                
                int left_change = 1;
                int right_change = 1;

                if (x == 0) left_change = 2;
                if (x == 3) right_change = 2;
                
                square.setBorder(BorderFactory.createMatteBorder(Constants.BORDER_WIDTH, Constants.BORDER_WIDTH * left_change, Constants.BORDER_WIDTH, Constants.BORDER_WIDTH * right_change, Constants.BORDER_COLOR));
                square.setLabel(new JLabel()); // empty for now
                window.add(square);
                row.add(0);
                panel_row.add(square);
            }
        }
        
        int _x = random.nextInt(4);
        int _y = random.nextInt(4);
        
        int randomNum = random.nextInt(1, 3) * 2;

        board.get(_y).set(_x, randomNum);
        panels.get(_y).get(_x).updateLabel(Integer.toString(randomNum));

        int __x;
        int __y;

        do {
            __x = random.nextInt(4);
            __y = random.nextInt(4);
        } while (__y == _y && __x == _x);

        randomNum = random.nextInt(1, 3) * 2;

        board.get(__y).set(__x, randomNum);
        panels.get(__y).get(__x).updateLabel(Integer.toString(randomNum));
    }

    public void setupWindow() {
        window.setSize(Constants.WIDTH, Constants.HEIGHT);
        window.setLayout(new GridLayout(4, 4));
        window.addKeyListener(new KeyListener() {
            @Override
            public void keyPressed(KeyEvent e) {}

            @Override
            public void keyTyped(KeyEvent e) {}

            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_UP || e.getKeyCode() == KeyEvent.VK_DOWN) handleVerticalInputs(e);
                else if (e.getKeyCode() == KeyEvent.VK_LEFT || e.getKeyCode() == KeyEvent.VK_RIGHT) handleHorizontalInputs(e);
                spawnNewValue();
            }
            
        });
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    public void show() {
        window.setVisible(true);
    }

    public void spawnNewValue() {
        int x = random.nextInt(4);
        int y = random.nextInt(4);
        
        int randomNum = random.nextInt(1, 3) * 2;

        while (true) {
            if (panels.get(y).get(x).label.getText() == "") break; // if at (x, y) there is no value/value = 0, then spawn value there
            else {
                x = random.nextInt(4);
                y = random.nextInt(4);
            }
        }

        panels.get(y).get(x).updateLabel(Integer.toString(randomNum));
        board.get(y).set(x, randomNum);
    }

    public void handleVerticalInputs(KeyEvent e) {
        /*
        same logic as horizontal just check that, but this time, when you loop through each x index, its different to get the row
        */
        // holy shit so much copied code that its going to make me cry
        // but ugly has a right to exist
        for (int x = 0; x < 4; x++) {
            ArrayList<Integer> col = new ArrayList<>();
            for (int y = 0; y < 4; y++) {
                col.add(board.get(y).get(x));
            }
            ArrayList<Integer> strippedCol = new ArrayList<>();
            for (Integer i : col) {
                if (i != 0) {
                    strippedCol.add(i);
                }
            }
            ArrayList<Integer> compressedCol = new ArrayList<>();
            for (int i = 0; i < strippedCol.size(); i++) {
                if (i != strippedCol.size() - 1) {
                    if (strippedCol.get(i) == strippedCol.get(i+1)) {
                        compressedCol.add(strippedCol.get(i) * 2);
                        i++;
                    }
                    else compressedCol.add(strippedCol.get(i));
                }
                else {
                    compressedCol.add(strippedCol.get(i));
                }
            }

            ArrayList<Integer> finalCol = new ArrayList<>();
            int spaces = 4 - compressedCol.size();
            if (e.getKeyCode() == KeyEvent.VK_DOWN) for (int j = 0; j < spaces; j++) finalCol.add(0);
            for (Integer k : compressedCol) finalCol.add(k);
            if (e.getKeyCode() == KeyEvent.VK_UP) for (int j = 0; j < spaces; j++) finalCol.add(0);

            for (int y = 0; y < 4; y++) {
                board.get(y).set(x, finalCol.get(y));
            }
        }
        for (int y = 0; y < 4; y++) {
            ArrayList<Canvas> panels_row = panels.get(y);
            for (int x = 0; x < 4; x++) {
                Canvas panel = panels_row.get(x);
                int val = board.get(y).get(x);
                panel.updateLabel(val == 0 ? "" : Integer.toString(val));
            }
        }
    }

    public void handleHorizontalInputs(KeyEvent e) {
        /* 
        simple
        loop through each row and get an array list containing all the values on that row (row is the y values)
        remove all occurences of 0 in the row (call the variable strippedRow)
        create finalRow array list
        get the spaces left by getting the answer of ( 4 - strippedRow.size() )
            RIGHT HERE, if the input is right, add that amount of spaces to the finalRow NOW
        now that you have the strippedRow, go through each index of the row
        if the number at index+1 has same value as number at index, combine the two values and add that value to final row
        then, skip the next number because you combined it already (do i++, and then when the loop goes again, it will i++, so it "skips" one)
            RIGHT HERE, if the input is left this time, then add the amount of spaces to the finalRow AFTER everything is done above
        replace the arraylist at that row with the new array list (the row strippedRow)
        */

        // this is probably wasting a lot of memory but i dont care as long as it works :)

        for (int y = 0; y < 4; y++) {
            ArrayList<Integer> row = board.get(y);
            ArrayList<Integer> strippedRow = new ArrayList<>();
            for (Integer i : row) {
                if (i != 0) {
                    strippedRow.add(i);
                }
            }
            ArrayList<Integer> compressedRow = new ArrayList<>();
            for (int i = 0; i < strippedRow.size(); i++) {
                if (i != strippedRow.size() - 1) {
                    if (strippedRow.get(i) == strippedRow.get(i+1)) {
                        compressedRow.add(strippedRow.get(i) * 2);
                        i++;
                    }
                    else compressedRow.add(strippedRow.get(i));
                }
                else {
                    compressedRow.add(strippedRow.get(i));
                }
            }
            ArrayList<Integer> finalRow = new ArrayList<>();
            int spaces = 4 - compressedRow.size();
            if (e.getKeyCode() == KeyEvent.VK_RIGHT) for (int j = 0; j < spaces; j++) finalRow.add(0);
            for (Integer k : compressedRow) finalRow.add(k);
            if (e.getKeyCode() == KeyEvent.VK_LEFT) for (int j = 0; j < spaces; j++) finalRow.add(0);
            board.set(y, finalRow);
        }
        for (int y = 0; y < 4; y++) {
            ArrayList<Canvas> panels_row = panels.get(y);
            for (int x = 0; x < 4; x++) {
                Canvas panel = panels_row.get(x);
                int val = board.get(y).get(x);
                panel.updateLabel(val == 0 ? "" : Integer.toString(val));
            }
        }
    }
}