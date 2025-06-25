import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report

df = pd.read_csv("transfusion.data") 
X = df.drop('target', axis=1)     
y = df['target']

from tpot import TPOTClassifier
from sklearn.model_selection import train_test_split

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=1)

# Define TPOT
tpot = TPOTClassifier(
    generations=5, 
    population_size=20, 
    verbosity=2,
    scoring='recall',           # To maximize recall
    random_state=1,
    n_jobs=-1
)

# Fit model

tpot.fit(X_train, y_train)


# Evaluate
print(tpot.score(X_test, y_test))
print("Classification Report:")
from sklearn.metrics import classification_report
print(classification_report(y_test, tpot.predict(X_test)))

# Export pipeline
tpot.export('best_pipeline.py')

