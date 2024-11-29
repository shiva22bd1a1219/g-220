# save_models.py
import os
from transformers import GPT2Tokenizer, GPT2Model

# Load models
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2Model.from_pretrained("gpt2")

# Define paths to save the models
model_save_path = 'models/gpt2_model'
tokenizer_save_path = 'models/gpt2_tokenizer'

# Create directories if they don't exist
os.makedirs(model_save_path, exist_ok=True)
os.makedirs(tokenizer_save_path, exist_ok=True)

# Save models
model.save_pretrained(model_save_path)
tokenizer.save_pretrained(tokenizer_save_path)

print("Models saved successfull")

























