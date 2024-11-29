# save_models.py
import os
from sentence_transformers import SentenceTransformer
from transformers import BartForConditionalGeneration, BartTokenizer

# Load models
embedding_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
bart_model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')
bart_tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')

# Define paths to save the models
model_save_path = 'models/sentence_transformer'
bart_model_save_path = 'models/bart_model'
tokenizer_save_path = 'models/tokenizer'

# Create directories if they don't exist
os.makedirs(model_save_path, exist_ok=True)
os.makedirs(bart_model_save_path, exist_ok=True)
os.makedirs(tokenizer_save_path, exist_ok=True)

# Save models
embedding_model.save(model_save_path)
bart_model.save_pretrained(bart_model_save_path)
bart_tokenizer.save_pretrained(tokenizer_save_path)

print("Models saved successfully.")
