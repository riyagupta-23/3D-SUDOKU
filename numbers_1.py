from fileinput import filename
import os
from PIL import Image, ImageDraw, ImageFont
from matplotlib.pyplot import grid# Assuming this is a module you have for generating Sudoku grids


directory = "valid-numbers"

def create_cell_images(font_size=20, border_width=2, border_color=(0, 0, 0)):
    cell_size = 30
    img_size = (cell_size, cell_size)
    font = ImageFont.load_default(font_size)

    if not os.path.exists(directory):
        os.makedirs(directory)

    for i in range(10):
            img = Image.new('RGB', img_size, color=(255, 255, 255))
            d = ImageDraw.Draw(img)

            # Draw border
            d.rectangle([border_width//2, border_width//2, cell_size-border_width//2, cell_size-border_width//2], outline=border_color, width=border_width)

            number = i
            if number != 0:
                position = (cell_size // 3, cell_size // 3 - 5)  # Adjust y-coordinate to move the number up
                d.text(position, str(number), fill=(255, 0, 0), font=font)

            filename = f'{directory}/cell_{i}.png'
            img.save(filename, format="PNG")


create_cell_images()