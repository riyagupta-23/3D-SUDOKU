from fileinput import filename
import os
from PIL import Image, ImageDraw, ImageFont
from matplotlib.pyplot import grid
from sudokuSolver import SudokuGenerator  # Assuming this is a module you have for generating Sudoku grids

def create_sudoku_image(grid, filename):
    # Image size
    img_size = 270
    cell_size = img_size // 9
    img = Image.new('RGB', (img_size, img_size), color = (255, 255, 255))
    d = ImageDraw.Draw(img)

    # Draw grid
    for i in range(10):
        line_width = 3 if i % 3 == 0 else 1
        d.line([(i * cell_size, 0), (i * cell_size, img_size)], fill=(0, 0, 0), width=line_width)
        d.line([(0, i * cell_size), (img_size, i * cell_size)], fill=(0, 0, 0), width=line_width)

    # Draw numbers
        font = ImageFont.load_default()
        for i in range(9):
            for j in range(9):
                number = grid[i][j]
                if number != 0:
                    position = (j * cell_size + cell_size // 3, i * cell_size + cell_size // 3)
                    d.text(position, str(number), fill=(0, 0, 0), font=font)

   # Save the image to a file
                    img.save(filename, format="PNG")


# Define the directory outside the function
directory1 = "puzzle1"
directory2 = "puzzle1_empty"


def create_cell_images(grid, font_size=20, border_width=3, border_color=(0, 0, 0)):
    cell_size = 30
    img_size = (cell_size, cell_size)
    font = ImageFont.load_default(font_size)

    if not os.path.exists(directory1):
        os.makedirs(directory1)

    for i in range(9):
        for j in range(9):
            img = Image.new('RGB', img_size, color=(255, 255, 255))
            d = ImageDraw.Draw(img)

            # Draw border
            d.rectangle([border_width//3, border_width//3, cell_size-border_width//3, cell_size-border_width//3], outline=border_color, width=border_width)

            number = grid[i][j]
            if number == 0:
                filename = f'{directory2}/cell_{i}_{j}.png'
                img.save(filename, format="PNG")
            elif number != 0:
                position = (cell_size // 3, cell_size // 3 - 5)  # Adjust y-coordinate to move the number up
                d.text(position, str(number), fill=(0, 0, 0), font=font)
                filename = f'{directory1}/cell_{i}_{j}.png'
                img.save(filename, format="PNG")


def updateGridCell(x, y, number, font_size=20):
    font = ImageFont.load_default(font_size)

    img = Image.new('RGB', (30, 30), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    d.rectangle([3//3, 3//3, 30-3//3, 30-3//3], outline=(0, 0, 0), width=3)

    position = (30 // 3, 30 // 3 - 5)  # Adjust y-coordinate to move the number up
    d.text(position, str(number), fill=(0, 0, 0), font=font)
    filename = f'{directory2}/cell_{x}_{y}.png'
    img.save(filename, format="PNG")

# Example grid to test the function
example_grid = SudokuGenerator()
#create_sudoku_image(example_grid.grid, 'new+puzzle.png')
#updateGridCell(0, 1, 4)

# Run the function with the example grid
#create_cell_images(example_grid.grid)

# Paths of a few sample images
# sample_image_paths = [f'{directory}/cell_{i}_{j}.png' for i in range(2) for j in range(2)]
# sample_image_paths
