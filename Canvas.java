import javax.swing.*;
import java.awt.*;

public class Canvas extends JPanel {
    public JLabel label;

    public void setLabel(JLabel label) {
        this.label = label;
        this.label.setFont(new Font("Serif", Font.PLAIN, 50));
        this.label.setForeground(Constants.TEXT_COLOR);
        this.add(label);
    }

    public void updateLabel(String text) {
        label.setText(text);
    }
}
