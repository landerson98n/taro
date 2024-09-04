'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

type TarotCard = {
  type: string
  name_short: string
  name: string
  value: string
  value_int: number
  meaning_up: string
  meaning_rev: string
  desc: string
}

type ReadingType = 'yesno' | 'three' | 'seven'

export default function TarotReader() {
  const [readingType, setReadingType] = useState<ReadingType>('yesno')
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([])
  const [isReading, setIsReading] = useState(false)
  const [allCards, setAllCards] = useState<TarotCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await fetch('https://tarotapi.dev/api/v1/cards/')
      const data = await response.json()
      setAllCards(data.cards)
      setIsLoading(false)
    } catch (err) {
      setError('Failed to load tarot cards. Please try again later.')
      setIsLoading(false)
    }
  }

  const drawCards = () => {
    setIsReading(true)
    const shuffled = [...allCards].sort(() => 0.5 - Math.random())
    const drawn = shuffled.slice(0, readingType === 'yesno' ? 1 : readingType === 'three' ? 3 : 7)
    setDrawnCards(drawn)
  }

  const getCardImage = (nameShort: string) => {
    return `https://sacred-texts.com/tarot/pkt/img/${nameShort}.jpg`
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">Leitor de Tarô</h1>

      <Select onValueChange={(value) => setReadingType(value as ReadingType)}>
        <SelectTrigger className="w-[200px] mb-4 text-white">
          <SelectValue placeholder="Tipo de leitura" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yesno">Sim/Não</SelectItem>
          <SelectItem value="three">3 Cartas</SelectItem>
          <SelectItem value="seven">7 Cartas</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={drawCards} disabled={isReading} className="mb-8">
        <Shuffle className="mr-2 h-4 w-4" /> Tirar Cartas
      </Button>

      <div className="flex justify-center flex-wrap gap-4">
        <AnimatePresence>
          {drawnCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="w-64 bg-white rounded-lg shadow-xl overflow-hidden">
                <CardContent className="p-4">
                  <img src={getCardImage(card.name_short)} alt={card.name} className="w-full h-auto object-cover mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{card.name}</h3>
                  <p className="text-sm mb-2"><strong>Significado (Normal):</strong> {card.meaning_up}</p>
                  <p className="text-sm"><strong>Significado (Invertida):</strong> {card.meaning_rev}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isReading && drawnCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: drawnCards.length * 0.2 + 0.5 }}
          className="mt-8 text-white text-center"
        >
          <h2 className="text-2xl font-semibold mb-2">Interpretação</h2>
          <p>
            {readingType === 'yesno'
              ? "Reflita sobre o significado desta carta em relação à sua pergunta de sim ou não."
              : `Aqui está sua leitura de ${readingType === 'three' ? '3' : '7'} cartas. Considere como cada carta se relaciona com as outras e com sua situação.`}
          </p>
        </motion.div>
      )}
    </div>
  )
}