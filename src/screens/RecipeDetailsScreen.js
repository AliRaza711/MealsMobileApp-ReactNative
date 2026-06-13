import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Linking 
} from 'react-native';

export default function RecipeDetailsScreen({ route }) {
  const { idMeal } = route.params;
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMealDetails();
  }, [idMeal]);

  const fetchMealDetails = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        setMeal(data.meals[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
  };

  const getIngredientsList = () => {
    if (!meal) return [];
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          item: ingredient.trim(),
          amount: measure ? measure.trim() : ''
        });
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FA4A0C" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Recipe details not found.</Text>
      </View>
    );
  }

  const ingredientsList = getIngredientsList();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
        
        {/* Overlapping Content Sheet */}
        <View style={styles.contentSheet}>
          <View style={styles.headerIndicator} />
          
          <Text style={styles.title}>{meal.strMeal}</Text>
          <View style={styles.tagsContainer}>
            <Text style={styles.tagText}>{meal.strCategory}</Text>
            <Text style={styles.tagDot}>•</Text>
            <Text style={styles.tagText}>{meal.strArea}</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsContainer}>
            {ingredientsList.map((ing, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={styles.ingredientBullet} />
                <Text style={styles.ingredientName}>{ing.item}</Text>
                <Text style={styles.ingredientAmount}>{ing.amount}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>

          
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA'
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  image: {
    width: '100%',
    height: 320,
  },
  contentSheet: {
    backgroundColor: '#FAFAFA',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 40,
  },
  headerIndicator: {
    width: 50,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#222',
    marginBottom: 10,
    lineHeight: 34,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  tagText: {
    fontSize: 15,
    color: '#FA4A0C',
    fontWeight: '700',
  },
  tagDot: {
    fontSize: 15,
    color: '#CCC',
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
  },
  ingredientsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#FA4A0C',
    borderRadius: 3,
    marginRight: 12,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
  },
  ingredientAmount: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  instructions: {
    fontSize: 16,
    color: '#555',
    lineHeight: 26,
    marginBottom: 40,
  },
  videoButton: {
    backgroundColor: '#222', // High contrast for the video button
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  videoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  }
});